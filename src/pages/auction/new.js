import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useToasts } from 'react-toast-notifications';
import { toNumber, has, noop, capitalize } from 'lodash';
import * as yup from 'yup';
import spacetime from 'spacetime';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import Toggle from '../../components/toggle';
import AuctionType from '../../components/auction-type';

import rem from '../../utils/rem';
import redirectWithSSR from '../../utils/redirectWithSSR';
import {
  dateTimePickerStyles,
  calendarStyles,
  clockStyles
} from '../../styles/date-time-picker';
import { buttonPrimary, buttonRounded } from '../../styles/button';

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
    endsAt: yup.date().min(validEndsAt, 'Duration should be > 10 mins')
  });

const validateFormData = (formData) => {
  const tenMinutesFromNow = spacetime.now().add(10, 'minutes').d;
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

// eslint-disable-next-line max-lines-per-function
const New = ({ user }) => {
  const { register, handleSubmit, errors } = useForm();

  const [expiryTime, setExpiryTime] = useState(new Date());

  const [hasBidsPublic, setBidsPublic] = useState(false);
  const toggle = () => setBidsPublic(!hasBidsPublic);

  const { addToast } = useToasts();
  const [createAuction] = useMutation(CREATE_AUCTION, {
    onError: (err) => {
      console.error({ err });
      addToast('There was some error', { appearance: 'error' });
    },
    onCompleted: (data) => {
      console.log({ data });
      addToast('Successfull!', { appearance: 'success' });
    }
  });

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
    createAuction({
      variables: {
        input: inputData
      }
    });
  };

  return (
    <Layout>
      <SEO title="Create a new auction" />

      <Heading>Create a new auction, {capitalize(user.displayName)}</Heading>
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
            <span
              onClick={toggle}
              onKeyPress={noop}
              role="button"
              tabIndex="0"
              css={css`
                ${labelStyles};
                margin-left: ${rem(8)};
                outline: none;
              `}
            >
              Show bids to the public?
            </span>
          </ToggleWrapper>
          <Error />
        </Field>

        <Field>
          <Row>
            <DateTimeWrapper>
              <label
                htmlFor="endsAt"
                css={css`
                  ${labelStyles};
                  display: block;
                  margin-bottom: ${rem(5)};
                `}
              >
                Expiry Date
              </label>
              <DateTimePicker
                {...dateTimePickerProps}
                required
                onChange={handleExpiryChange}
                value={expiryTime}
                name="endsAt"
              />
              <Error>
                {has(validationErrors, 'endsAt') && validationErrors.endsAt}
              </Error>
            </DateTimeWrapper>

            <div>
              <label
                htmlFor="winnerCount"
                css={css`
                  ${labelStyles};
                  display: block;
                  margin-bottom: ${rem(5)};
                `}
              >
                Number of winners allowed
              </label>
              <input
                {...winnerCountInputProps}
                css={css`
                  width: ${rem(200)};
                  display: block;
                `}
                ref={register({ min: 1, max: 100, required: true })}
                id="winnerCount"
                name="winnerCount"
              />
              <Error>
                {errors.winnerCount ? `Number should be from 0-10` : ''}
              </Error>
            </div>
          </Row>
        </Field>

        <Field>
          <label
            htmlFor="description"
            css={css`
              ${labelStyles};
              display: block;
              margin-bottom: ${rem(5)};
            `}
          >
            Description
          </label>
          <TextArea
            name="description"
            placeholder="What this auction is about?"
            ref={register({ required: true })}
            id="description"
          />
          <Error>{errors.description ? `"Description" is required` : ''}</Error>
        </Field>

        <ActionRow>
          <PrimaryButton type="submit">Create auction</PrimaryButton>
        </ActionRow>
      </form>
    </Layout>
  );
};

New.getInitialProps = ({ req, res }) => {
  const user = req && req.session ? req.session.user : null;

  if (!user) {
    redirectWithSSR({ res, path: '/login' });
    return {};
  }

  return { user };
};

New.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired
  }).isRequired
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
  font-size: ${rem(18)};
  font-weight: 500;
  color: #222;
  user-select: none;
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

const Error = styled.small`
  color: #d8000c;
  display: block;
  margin-top: ${rem(2)};
  min-height: ${rem(14)};
`;

const TextArea = styled.textarea`
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

  font-size: ${rem(18)};
  padding: ${rem(10)} ${rem(30)};
`;
