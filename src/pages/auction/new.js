import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useToasts } from 'react-toast-notifications';
import { toNumber, get, noop, isEmpty } from 'lodash';
import * as yup from 'yup';
import addMinutes from 'date-fns/addMinutes';
import { useModal } from 'react-modal-hook';
import { useRouter } from 'next/router';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import Toggle from '../../components/toggle';
import AuctionType from '../../components/auction-type';
import PayoutMethodModal from '../../components/modal/payout-method';
import VerifyPayoutAccountModal from '../../components/modal/verify-payout-account';
import LoadingText from '../../components/loading-text';

import {
  dateTimePickerStyles,
  calendarStyles,
  clockStyles
} from '../../styles/date-time-picker';
import {
  buttonPrimary,
  buttonRounded,
  buttonDisabled
} from '../../styles/button';
import { errorBasic, labelBasic, inputBasic } from '../../styles/form';

import useSession from '../../hooks/use-session';
import { auth } from '../../utils/firebase';
import rem from '../../utils/rem';
import theme from '../../utils/theme';
import redirectWithSSR from '../../utils/redirect-with-ssr';
import { getErrorMessage } from '../../utils/error';

const dateTimePickerProps = {
  showLeadingZeros: true,
  format: 'dd/MM/y hh:mm a',
  calendarIcon: null,
  clearIcon: null,
  dayPlaceholder: 'dd',
  monthPlaceholder: 'mm',
  yearPlaceholder: 'yyyy',
  minDetail: 'year'
};

const winnerCountInputProps = {
  type: 'number',
  defaultValue: '1',
  min: 1,
  max: 100,
  required: true
};

const CREATE_AUCTION = gql`
  mutation createAuction($input: AuctionCreateInput!) {
    createAuction(data: $input) {
      id
      creatorId

      description
      endsAt
      type
      hasBidsVisible
      isCanceled

      createdAt
      updatedAt
    }
  }
`;

const formatInput = (input) => {
  return {
    ...input,
    winnerCount: toNumber(input.winnerCount)
  };
};

const getSchema = ({ validEndsAt }) =>
  yup.object().shape({
    endsAt: yup
      .date()
      .typeError(`"Expiry Date" must be a valid date.`)
      .required(`"Expiry Date" is required.`)
      .min(validEndsAt, `"Expiry Date" should be > 10 mins`)
  });

const validateFormData = (formData) => {
  const tenMinutesFromNow = addMinutes(new Date(), 10);
  const schema = getSchema({ validEndsAt: tenMinutesFromNow });

  return schema
    .validate(formData, { abortEarly: false })
    .then(() => {
      return [null, true];
    })
    .catch((validationErrors) => {
      const validationError = validationErrors.inner.reduce(
        (accumulator, error) => ({
          ...accumulator,
          [error.path]: error.message
        }),
        {}
      );

      return [validationError, false];
    });
};

const schema = {
  winnerCount: {
    min: {
      value: 1,
      message: 'Has to be between 0-10.'
    },
    max: {
      value: 10,
      message: 'Has to be between 0-10.'
    },
    required: {
      value: true,
      message: `"Winner count" is required.`
    }
  },
  description: {
    required: {
      value: true,
      message: `"Description" is required.`
    }
  }
};

// eslint-disable-next-line max-lines-per-function
const New = () => {
  const { user, isUserLoading } = useSession();
  const { register, handleSubmit, errors } = useForm();
  const router = useRouter();

  const [expiryTime, setExpiryTime] = useState(addMinutes(new Date(), 15));

  const [hasBidsPublic, setBidsPublic] = useState(true);
  const toggle = () => setBidsPublic(!hasBidsPublic);

  const { addToast } = useToasts();
  const [createAuction, { loading: isCreatingAuction }] = useMutation(
    CREATE_AUCTION,
    {
      onError: (error) => {
        const errorMessage = getErrorMessage(
          error,
          "Couldn't create the auction"
        );
        addToast(errorMessage, {
          appearance: 'error'
        });
      },
      onCompleted: ({ createAuction: response }) => {
        addToast('Auction created.', {
          appearance: 'success',
          autoDismiss: true,
          autoDismissTimeout: 3000,
          onDismiss: () => router.push(`/auction/${response.id}`)
        });
      }
    }
  );

  const [
    reloadOnCancellingVerification,
    setReloadOnCancellingVerification
  ] = useState(true);

  const handleVerifyAccountCancel = () => {
    addToast("User couldn't be verified", {
      appearance: 'error',
      autoDismiss: true,
      autoDismissTimeout: 3000,
      onDismiss: reloadOnCancellingVerification ? router.reload : noop
    });
  };

  const [
    showVerifyPayoutAccountModal,
    hideVerifyPayoutAccountModal
  ] = useModal(
    () => (
      <VerifyPayoutAccountModal
        onClose={hideVerifyPayoutAccountModal}
        onCancel={handleVerifyAccountCancel}
      />
    ),
    [handleVerifyAccountCancel]
  );

  const [showPayoutMethodModal, hidePayoutMethodModal] = useModal(
    () => (
      <PayoutMethodModal
        onClose={hidePayoutMethodModal}
        user={user}
        showConfirmVerificationModal={() => {
          setReloadOnCancellingVerification(true);
          showVerifyPayoutAccountModal();
        }}
      />
    ),
    [user, showVerifyPayoutAccountModal]
  );

  const [validationErrors, setValidationErrors] = useState(null);
  const doValidation = async (formData) => {
    const [formErrors, validationStatus] = await validateFormData(formData);
    if (!validationStatus) {
      setValidationErrors(formErrors);
      return false;
    }

    setValidationErrors(null);
    return true;
  };

  const handleExpiryChange = (expiryDate) => {
    setExpiryTime(expiryDate);
    return doValidation({
      endsAt: expiryDate
    });
  };

  const beforeSubmit = (callbackFn) => async (formData) => {
    const inputData = formatInput({
      ...formData,
      hasBidsVisible: hasBidsPublic,
      endsAt: expiryTime
    });

    const validationStatus = await doValidation(inputData);
    if (!validationStatus) {
      return;
    }

    callbackFn(inputData);
  };

  const onSubmit = async (inputData) => {
    if (!user.paymentPayoutAccount) {
      addToast(`Oops. You haven't setup a payout account`, {
        appearance: 'info',
        autoDismiss: true
      });
      showPayoutMethodModal();
      return;
    }

    const {
      isVerificationRequired,
      paymentMethods: payoutMethods
    } = user.paymentPayoutAccount;

    if (isVerificationRequired) {
      addToast(`Oops. You haven't been verified yet`, {
        appearance: 'info',
        autoDismiss: true
      });
      setReloadOnCancellingVerification(false);
      showVerifyPayoutAccountModal();
      return;
    }

    if (isEmpty(payoutMethods)) {
      addToast(`Oops. You don't have any payout method`, {
        appearance: 'info',
        autoDismiss: true
      });
      showPayoutMethodModal();
      return;
    }

    createAuction({
      variables: {
        input: inputData
      }
    });
  };

  const isCTADisabled =
    !isEmpty(errors) ||
    !isEmpty(validationErrors) ||
    isCreatingAuction ||
    isUserLoading;

  return (
    <Layout>
      <SEO title="Create a new auction" />

      <Heading>Create a new auction</Heading>
      <form onSubmit={handleSubmit(beforeSubmit(onSubmit))}>
        <Field>
          <AuctionTypeWrapper>
            <AuctionType
              ref={register}
              name="type"
              value="HIGHEST_BID_WINS"
              id="highest-bid-wins"
              defaultChecked={true}
            >
              <CardTitle>Highest Bid</CardTitle>
              <CardDescription>
                The one with the highest bid, wins!
              </CardDescription>
            </AuctionType>

            <AuctionType
              ref={register}
              name="type"
              value="CLOSEST_BID_WINS"
              id="closest-bid-wins"
            >
              <CardTitle>Closest Guess</CardTitle>
              <CardDescription>
                The one with the closest bid, wins!
              </CardDescription>
            </AuctionType>
          </AuctionTypeWrapper>
          <Error />
        </Field>

        <Field>
          <ToggleWrapper>
            <Toggle
              name="hasBidsVisible"
              isOn={hasBidsPublic}
              onClick={toggle}
            />
            <FakeLabel
              onClick={toggle}
              onKeyPress={noop}
              role="button"
              tabIndex="0"
            >
              Show bids to the public?
            </FakeLabel>
          </ToggleWrapper>
          <Error />
        </Field>

        <Field>
          <Row>
            <DateTimeWrapper>
              <Label htmlFor="endsAt">Expiry Date</Label>
              <DateTimePicker
                {...dateTimePickerProps}
                required
                onChange={handleExpiryChange}
                value={expiryTime}
                name="endsAt"
              />
              <Error>{get(validationErrors, 'endsAt')}</Error>
            </DateTimeWrapper>

            <div>
              <Label htmlFor="winnerCount">Number of winners allowed</Label>
              <Input
                {...winnerCountInputProps}
                ref={register(schema.winnerCount)}
                id="winnerCount"
                name="winnerCount"
              />
              <Error>{get(errors, 'winnerCount.message')}</Error>
            </div>
          </Row>
        </Field>

        <Field>
          <Label htmlFor="description">Description</Label>
          <TextArea
            name="description"
            placeholder="What this auction is about?"
            ref={register(schema.description)}
            id="description"
          />
          <Error>{get(errors, 'description.message')}</Error>
        </Field>

        <ActionRow>
          <PrimaryButton type="submit" disabled={isCTADisabled}>
            {!isCreatingAuction ? (
              'Create auction'
            ) : (
              <LoadingText text="Creating" />
            )}
          </PrimaryButton>
        </ActionRow>
      </form>
    </Layout>
  );
};

New.getInitialProps = ({ req, res }) => {
  const isServer = !process.browser;

  const user = isServer
    ? req && req.session
      ? req.session.user
      : null
    : auth.currentUser;
  if (!user) {
    redirectWithSSR({ res, path: '/' });
  }

  return {};
};

New.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired
  })
};

export default New;

/*
 ********************************************
 styled components
 ********************************************
 */

const Heading = styled.div`
  font-size: ${rem(26)};
  font-weight: 500;

  margin-bottom: ${rem(50)};
`;

const Field = styled.div`
  margin-top: ${rem(20)};
`;

const AuctionTypeWrapper = styled.div`
  display: flex;
`;
const CardTitle = styled.div`
  font-size: ${rem(22)};
`;
const CardDescription = styled.div`
  margin-top: ${rem(15)};
  color: rgba(120, 129, 136);
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const labelStyles = css`
  ${labelBasic};
  font-size: ${rem(19)};
`;

const Label = styled.label`
  ${labelStyles};
  display: block;
  margin-bottom: ${rem(5)};
`;

const FakeLabel = styled.span`
  ${labelStyles};
  margin-left: ${rem(5)};
  position: relative;
  top: -1px;
  outline: none;
`;

const DateTimeWrapper = styled.div`
  ${dateTimePickerStyles};
  ${calendarStyles};
  ${clockStyles};

  font-size: ${rem(18)};
`;

const Row = styled.div`
  display: flex;

  flex-direction: column;
  > div:nth-child(2) {
    margin-top: ${rem(20)};
  }
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    flex-direction: row;
    > div:nth-child(2) {
      margin-top: 0;
    }
  }

  ${DateTimeWrapper} {
    margin-right: ${rem(70)};
  }
`;

const Error = styled.div`
  ${errorBasic};
`;

const Input = styled.input`
  ${inputBasic};
  width: ${rem(200)};
  display: block;
`;

const TextArea = styled.textarea`
  ${inputBasic};
  width: 80%;
  min-height: ${rem(120)};
  display: block;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: ${rem(20)};
`;

const PrimaryButton = styled.button`
  ${buttonPrimary};
  ${buttonRounded};
  ${buttonDisabled};

  font-size: ${rem(18)};
  padding: ${rem(10)} ${rem(30)};
`;
