import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import ReactModal from 'react-modal';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Script from 'react-load-script';
import getConfig from 'next/config';
import { useToasts } from 'react-toast-notifications';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { get, some } from 'lodash';
import { useRouter } from 'next/router';

import Loading from '../loading';
import LoadingText from '../loading-text';

import rem from '../../utils/rem';
import { getAddress, validateAddress } from '../../utils/address';
import { getErrorMessage } from '../../utils/error';

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
import { CARD_OPTIONS } from '../../styles/stripe';
import { inputBasic, errorBasic, labelBasic } from '../../styles/form';

const { publicRuntimeConfig } = getConfig();
const mapsApiUrl = `https://maps.googleapis.com/maps/api/js?key=${publicRuntimeConfig.googleMapsKey}&libraries=places`;

const CREATE_PAYOUT_ACCOUNT = gql`
  # input CreatePaymentPayoutAccountInput {
  #   country: String!
  #   paymentMethodId: String
  # }
  mutation($input: CreatePaymentPayoutAccountInput!) {
    createPaymentPayoutAccount(data: $input) {
      id
      type
      country
      currency
      isVerificationRequired
      paymentMethods {
        id
      }
    }
  }
`;

const ATTACH_PAYOUT_METHOD = gql`
  mutation($input: AttachPaymentMethodDataInput!) {
    attachPayoutPaymentMethod(data: $input) {
      id
    }
  }
`;

const hasError = (formError) => some(formError, Boolean);

// eslint-disable-next-line max-lines-per-function
const PayoutMethod = ({ onClose, user, showConfirmVerificationModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const autocompleteRef = useRef(null);
  const autocompleteInputRef = useRef(null);

  const { addToast } = useToasts();
  const [isScriptLoaded, setScriptLoaded] = useState(false);

  const [address, setAddress] = useState({
    address_state: '',
    address_city: '',
    address_country: '',
    address_zip: '',
    formatted_address: ''
  });

  const [formError, setFormError] = useState({
    card: false,
    address: false
  });

  const handleError = (error) => {
    const errorMessage = getErrorMessage(
      error,
      'An error occurred while adding the payout method'
    );
    addToast(errorMessage, {
      appearance: 'error',
      autoDismiss: true
    });
    onClose();
  };

  const [
    createPaymentPayoutAccount,
    { loading: isCreatingAccount }
  ] = useMutation(CREATE_PAYOUT_ACCOUNT, {
    onError: handleError,
    onCompleted: (data) => {
      const { isVerificationRequired } = data.createPaymentPayoutAccount;
      if (!isVerificationRequired) {
        addToast(`Woohoo, you can now create the auction.`, {
          appearance: 'success',
          autoDismiss: true,
          autoDismissTimeout: 3000,
          onDismiss: router.reload
        });

        onClose();
        return;
      }

      onClose();
      setTimeout(showConfirmVerificationModal, 1000);
    }
  });

  const [
    attachPayoutMethod,
    { loading: isAttachingPayoutMethod }
  ] = useMutation(ATTACH_PAYOUT_METHOD, {
    onError: handleError,
    onCompleted: () => {
      addToast(`Woohoo, you can now create the auction.`, {
        appearance: 'success',
        autoDismiss: true,
        autoDismissTimeout: 3000,
        onDismiss: router.reload
      });

      onClose();
    }
  });

  const handleAddressBlur = () => {
    // if the user fills a random value, backtrack it to the last selected one.
    // Note: onBlur gets called before Google Maps set the value of the input.
    autocompleteInputRef.current.value = address.formatted_address;
  };

  const handlePlaceChange = () => {
    const {
      address_components,
      formatted_address
    } = autocompleteRef.current.getPlace();

    const newAddress = getAddress(address_components);
    setAddress({ ...newAddress, formatted_address });

    if (validateAddress(newAddress)) {
      setFormError((prevError) => ({
        ...prevError,
        address: false
      }));
    }
  };

  const handleScriptCreate = () => setScriptLoaded(false);
  const handleScriptError = () => {
    setScriptLoaded(true);
    addToast('There was an error loading Google Maps API', {
      appearance: 'error'
    });
  };

  const handleScriptLoad = () => {
    setScriptLoaded(true);

    const options = {
      types: ['geocode']
    };

    // eslint-disable-next-line no-undef
    if (!google) {
      addToast('Error while loading Google Maps library.', {
        appearance: 'error'
      });
      return;
    }

    // eslint-disable-next-line no-undef
    autocompleteRef.current = new google.maps.places.Autocomplete(
      autocompleteInputRef.current,
      options
    );
    autocompleteRef.current.setFields([
      'address_component',
      'formatted_address'
    ]);
    autocompleteRef.current.addListener('place_changed', handlePlaceChange);
  };

  const handleCardChange = ({ error, empty }) => {
    if (empty) {
      setFormError((prevError) => ({
        ...prevError,
        card: 'Please fill in your card details.'
      }));

      return;
    }

    setFormError((prevError) => ({
      ...prevError,
      card: get(error, 'message', false)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    let isFormInvalid = false;

    // check card field
    const cardElement = elements.getElement(CardElement);
    if (cardElement._empty) {
      setFormError((error) => ({
        ...error,
        card: 'Please fill in your card details.'
      }));

      isFormInvalid = true;
    }

    // check if address is valid
    const addressInputValue = autocompleteInputRef.current.value;
    const isAddressValid = validateAddress(address);
    if (!addressInputValue || !isAddressValid) {
      setFormError((error) => ({
        ...error,
        address: 'Your address is invalid.'
      }));

      isFormInvalid = true;
    }

    // can't rely on state at this moment to check error, state updation is delayed.
    if (isFormInvalid) {
      return;
    }

    const {
      address_city,
      address_state,
      address_country,
      address_zip
    } = address;

    const { token, error } = await stripe.createToken(cardElement, {
      name: user.name,
      currency: 'USD',
      address_city,
      address_state,
      address_country,
      address_zip
    });

    if (error) {
      addToast(`Couldn't process the card`, {
        appearance: 'error',
        autoDismiss: true
      });

      return;
    }

    if (!user.paymentPayoutAccount) {
      createPaymentPayoutAccount({
        variables: {
          input: {
            country: address.address_country,
            paymentMethodId: token.id
          }
        }
      });

      return;
    }

    attachPayoutMethod({
      variables: {
        input: {
          paymentMethodId: token.id
        }
      }
    });
  };

  if (!stripe || !elements) {
    return <Loading />;
  }

  const isSubmitting = user.paymentPayoutAccount
    ? isAttachingPayoutMethod
    : isCreatingAccount;
  const isCTADisabled = hasError(formError) || isSubmitting;

  return (
    <ReactModal
      style={{ overlay: modalOverlay }}
      css={modalContent}
      isOpen={true}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
    >
      <Head>
        <Title>Add payout method</Title>
        <Note>Balance will show up only after the auction ends.</Note>
      </Head>

      <Body>
        <Field>
          <Label>Debit card</Label>
          <InputWrapper>
            <CardElement options={CARD_OPTIONS} onChange={handleCardChange} />
          </InputWrapper>
          <ErrorMessage>{formError.card}</ErrorMessage>
        </Field>

        <Field>
          <Label>Address</Label>
          <AutocompleteInput
            ref={autocompleteInputRef}
            placeholder="Enter your address"
            onBlur={handleAddressBlur}
            disabled={!isScriptLoaded}
          />
          <ErrorMessage>{formError.address}</ErrorMessage>
        </Field>
      </Body>

      <Footer>
        <CTARow>
          <Cancel onClick={onClose}>Cancel</Cancel>
          <Continue onClick={handleSubmit} disabled={isCTADisabled}>
            {!isSubmitting ? 'Add card' : <LoadingText text="Adding card" />}
          </Continue>
        </CTARow>
      </Footer>

      <Script
        url={mapsApiUrl}
        onCreate={handleScriptCreate}
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
    </ReactModal>
  );
};

PayoutMethod.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    paymentPayoutAccount: PropTypes.shape()
  }),
  showConfirmVerificationModal: PropTypes.func.isRequired
};

export default PayoutMethod;

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

const InputWrapper = styled.div`
  ${inputBasic};
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

const Field = styled.div`
  margin-top: ${rem(10)};
  :first-child {
    margin-top: 0;
  }
`;

const AutocompleteInput = styled.input`
  ${inputBasic};
  outline: none;
  width: 100%;
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
