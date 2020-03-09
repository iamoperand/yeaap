import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useToasts } from 'react-toast-notifications';
import { toNumber, get, noop } from 'lodash';
import * as yup from 'yup';
import addMinutes from 'date-fns/addMinutes';
import { useModal } from 'react-modal-hook';
import { useRouter } from 'next/router';
import getConfig from 'next/config';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import Toggle from '../../components/toggle';
import AuctionType from '../../components/auction-type';
import PayoutMethodModal from '../../components/modal/payout-method';
import ConfirmationModal from '../../components/modal/confirmation';

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
import rem from '../../utils/rem';
import redirectWithSSR from '../../utils/redirect-with-ssr';
import { openPopup, pollPopup } from '../../utils/popup';
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

const VERIFY_PAYOUT_ACCOUNT = gql`
  # input CreatePaymentPayoutAccountOnboardingLinkDataInput {
  #   failureRedirectUrl: URL!
  #   successRedirectUrl: URL!
  # }
  mutation($input: CreatePaymentPayoutAccountOnboardingLinkDataInput!) {
    createPaymentPayoutAccountOnboardingUrl(data: $input)
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

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

const failureRedirectUrl = `${apiUrl}/user-verification?status=failure`;
const successRedirectUrl = `${apiUrl}/user-verification?status=success`;

// eslint-disable-next-line max-lines-per-function
const New = () => {
  const { user, isUserLoading } = useSession();
  const { register, handleSubmit, errors } = useForm();
  const router = useRouter();

  const [expiryTime, setExpiryTime] = useState(addMinutes(new Date(), 15));

  const [hasBidsPublic, setBidsPublic] = useState(true);
  const toggle = () => setBidsPublic(!hasBidsPublic);

  const { addToast } = useToasts();
  const [createAuction] = useMutation(CREATE_AUCTION, {
    onError: (err) => {
      const errorMessage = getErrorMessage(err, "Couldn't create the auction");
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
  });

  const handleContinue = () => {
    // fire out the mutation
    verifyPayoutAccount({
      variables: {
        input: {
          failureRedirectUrl,
          successRedirectUrl
        }
      }
    });
  };
  const handleCancel = () => {
    addToast(`User couldn't be verified`, {
      appearance: 'error',
      autoDismiss: true,
      autoDismissTimeout: 3000,
      onDismiss: router.reload
    });
  };

  const [showConfirmVerificationModal, hideConfirmVerificationModal] = useModal(
    () => (
      <ConfirmationModal
        onClose={hideConfirmVerificationModal}
        title="Verify user"
        onContinue={handleContinue}
        onCancel={handleCancel}
        continueButtonLabel="Verify user"
      >
        <Text>
          {`Stripe needs to verify the user in order to carry out smooth out-flow
          of payments. This won't take long, I promise!`}
        </Text>
      </ConfirmationModal>
    ),
    [handleContinue, handleCancel]
  );

  const [verifyPayoutAccount] = useMutation(VERIFY_PAYOUT_ACCOUNT, {
    onError: (error) => {
      const errorMessage = getErrorMessage(
        error,
        'An error occurred while verifying the user'
      );
      addToast(errorMessage, {
        appearance: 'error',
        autoDismiss: true
      });

      hideConfirmVerificationModal();
    },
    onCompleted: ({ createPaymentPayoutAccountOnboardingUrl: url }) => {
      if (!url) {
        addToast(`Invalid URL sent by stripe.`, {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 3000,
          onDismiss: router.reload
        });
        hideConfirmVerificationModal();
        return;
      }

      const popup = openPopup({ url });
      pollPopup(popup, {
        pollTimeout: 2000,
        successUrl: successRedirectUrl,
        failureUrl: failureRedirectUrl,
        onSuccess: () => {
          addToast(`Woohoo, you can now create the auction.`, {
            appearance: 'success',
            autoDismiss: true,
            autoDismissTimeout: 3000,
            onDismiss: router.reload
          });

          hideConfirmVerificationModal();
        },
        onFailure: (message) => {
          addToast(message, {
            appearance: 'error',
            autoDismiss: true,
            autoDismissTimeout: 3000,
            onDismiss: router.reload
          });

          hideConfirmVerificationModal();
        }
      });
    }
  });

  const [showPayoutMethodModal, hidePayoutMethodModal] = useModal(
    () => (
      <PayoutMethodModal
        onClose={hidePayoutMethodModal}
        user={user}
        showConfirmVerificationModal={showConfirmVerificationModal}
      />
    ),
    [user, showConfirmVerificationModal]
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
      addToast(`Oops. You don't have any payout method.`, {
        appearance: 'info',
        autoDismiss: true
      });
      showPayoutMethodModal();
      return;
    }

    if (user.paymentPayoutAccount.isVerificationRequired) {
      addToast(`Oops. You haven't been verified yet.`, {
        appearance: 'info',
        autoDismiss: true
      });
      showConfirmVerificationModal();
      return;
    }

    createAuction({
      variables: {
        input: inputData
      }
    });
  };

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
          <PrimaryButton type="submit" disabled={isUserLoading}>
            Create auction
          </PrimaryButton>
        </ActionRow>
      </form>
    </Layout>
  );
};

New.getInitialProps = ({ req, res }) => {
  const user = req && req.session ? req.session.user : null;
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

  margin-top: ${rem(30)};
`;

const PrimaryButton = styled.button`
  ${buttonPrimary};
  ${buttonRounded};
  ${buttonDisabled};

  font-size: ${rem(18)};
  padding: ${rem(10)} ${rem(30)};
`;

const Text = styled.div`
  margin-bottom: ${rem(5)};
  :last-child {
    margin-bottom: 0;
  }
`;
