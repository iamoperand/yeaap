import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import ReactModal from 'react-modal';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { get, some } from 'lodash';
import * as yup from 'yup';
import addMinutes from 'date-fns/addMinutes';
import { useToasts } from 'react-toast-notifications';

import rem from '../../utils/rem';

import {
  modalBasic,
  modalCentered,
  modalBorder,
  modalOverlay,
  modalHead,
  modalBody,
  modalFooter,
  modalCTARow,
  continueButton,
  cancelButton,
  modalTitle,
  modalNote
} from '../../styles/modal';
import { labelBasic, inputBasic, errorBasic } from '../../styles/form';
import {
  dateTimePickerStyles,
  calendarStyles,
  clockStyles
} from '../../styles/date-time-picker';

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

const getSchema = ({ validEndsAt }) =>
  yup.object().shape({
    description: yup.string().required(`"Description" is required.`),
    endsAt: yup
      .date()
      .typeError(`"Expiry Date" must be a valid date.`)
      .required(`"Expiry Date" is required.`)
      .min(validEndsAt, `"Expiry Date" should be > 10 mins`)
  });

const validateFieldData = (formData) => {
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

const initialErrorState = {
  description: false,
  endsAt: false
};

// eslint-disable-next-line max-lines-per-function
const EditAuction = ({
  onClose,
  onSubmit,
  auctionDescription,
  auctionEndsAt
}) => {
  const [description, setDescription] = useState(auctionDescription);
  const [expiryDate, setExpiryDate] = useState(new Date(auctionEndsAt));

  const [errors, setErrors] = useState(initialErrorState);

  const doValidation = async (fieldData) => {
    const [formErrors, validationStatus] = await validateFieldData(fieldData);
    if (!validationStatus) {
      setErrors(formErrors);
      return false;
    }

    setErrors(initialErrorState);
    return true;
  };

  const validate = (fieldData) => {
    const formData = {
      description,
      endsAt: expiryDate
    };
    doValidation({ ...formData, ...fieldData });
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    validate({ description: event.target.value });
  };

  const handleExpiryDateChange = (endsAt) => {
    setExpiryDate(endsAt);
    validate({ endsAt });
  };

  const hasError = some(errors, (error) => !!error);
  const { addToast } = useToasts();

  const handleSubmit = () => {
    if (hasError) {
      addToast('Please rectify the errors in the form', {
        appearance: 'error',
        autoDismiss: true
      });
      return;
    }

    onSubmit({
      description,
      endsAt: expiryDate
    });
  };

  const isCTADisabled = hasError;

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      style={{ overlay: modalOverlay }}
      css={modalContent}
    >
      <Head>
        <Title>Edit auction</Title>
        <Note>
          You can only update <Bold>description</Bold> and{' '}
          <Bold>expiry date</Bold>.
        </Note>
      </Head>

      <Body>
        <Field>
          <Label htmlFor="description">Description</Label>
          <TextArea
            name="description"
            placeholder="What this auction is about?"
            value={description}
            onChange={handleDescriptionChange}
            id="description"
          />
          <ErrorMessage>{get(errors, 'description')}</ErrorMessage>
        </Field>
        <Field>
          <DateTimeWrapper>
            <Label htmlFor="endsAt">Expiry Date</Label>
            <DateTimePicker
              {...dateTimePickerProps}
              required
              onChange={handleExpiryDateChange}
              value={expiryDate}
              name="endsAt"
            />
            <ErrorMessage>{get(errors, 'endsAt')}</ErrorMessage>
          </DateTimeWrapper>
        </Field>
      </Body>

      <Footer>
        <CTARow>
          <Cancel onClick={onClose}>Cancel</Cancel>
          <Continue onClick={handleSubmit} disabled={isCTADisabled}>
            Update auction
          </Continue>
        </CTARow>
      </Footer>
    </ReactModal>
  );
};
EditAuction.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  auctionDescription: PropTypes.string.isRequired,
  auctionEndsAt: PropTypes.string.isRequired
};

export default EditAuction;

/*
 ********************************************
 styled components
 ********************************************
 */

const modalContent = css`
  ${modalBasic};
  ${modalCentered};
  ${modalBorder};
`;

const Head = styled.div`
  ${modalHead};
`;

const Title = styled.div`
  ${modalTitle};
`;

const Note = styled.small`
  ${modalNote};
`;

const Body = styled.div`
  ${modalBody};
`;

const Footer = styled.div`
  ${modalFooter};
`;

const Label = styled.div`
  ${labelBasic};
  margin-bottom: ${rem(5)};
  font-size: ${rem(17)};
`;

const CTARow = styled.div`
  ${modalCTARow};
`;

const Continue = styled.button`
  ${continueButton};
`;

const Cancel = styled.button`
  ${cancelButton};
`;

const ErrorMessage = styled.div`
  ${errorBasic};
`;

const Bold = styled.span`
  font-weight: 500;
`;

const Field = styled.div`
  margin-top: ${rem(10)};
  :first-child {
    margin-top: 0;
  }
`;

const TextArea = styled.textarea`
  ${inputBasic};
  width: 100%;
  min-height: ${rem(80)};
  display: block;
`;

const DateTimeWrapper = styled.div`
  ${dateTimePickerStyles};
  ${calendarStyles};
  ${clockStyles};

  font-size: ${rem(18)};
`;
