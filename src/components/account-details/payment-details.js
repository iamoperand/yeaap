import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { capitalize, isEmpty, get } from 'lodash';
import { useModal } from 'react-modal-hook';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useToasts } from 'react-toast-notifications';
import { useRouter } from 'next/router';

import theme from '../../utils/theme';
import rem from '../../utils/rem';
import { getErrorMessage } from '../../utils/error';

import { boxBorder } from '../../styles/box';
import { buttonWhite, buttonRounded } from '../../styles/button';

import CrossIcon from '../../assets/icons/cross.svg?sprite';
import RestrictedIcon from '../../assets/icons/restricted.svg?sprite';

import CardBrand from './card-brand';
import ConfirmationModal from '../modal/confirmation';
import PaymentMethodModal from '../modal/payment-method';
import PayoutMethodModal from '../modal/payout-method';
import VerifyPayoutAccountModal from '../modal/verify-payout-account';

const REMOVE_PAYMENT_METHOD = gql`
  mutation removePaymentMethod($where: PaymentMethodWhereInput!) {
    removePaymentMethod(where: $where)
  }
`;

const REMOVE_PAYOUT_METHOD = gql`
  mutation removePayoutPaymentMethod($where: PaymentMethodWhereInput!) {
    removePayoutPaymentMethod(where: $where)
  }
`;

const CardDetails = ({ source }) => (
  <>
    <CardBrandWrapper>
      <CardBrand brand={source.brand} />
    </CardBrandWrapper>
    <Text>
      <b>{capitalize(source.brand)}</b>
      {' card ending in '}
      <b>{source.last4}</b>
    </Text>
  </>
);

CardDetails.propTypes = {
  source: PropTypes.shape({
    brand: PropTypes.string.isRequired,
    last4: PropTypes.string.isRequired
  }).isRequired
};

// eslint-disable-next-line max-lines-per-function
const PaymentDetails = ({ user }) => {
  const { paymentMethods, paymentPayoutAccount } = user;
  const payoutMethods = get(paymentPayoutAccount, 'paymentMethods');
  const isVerificationRequired = get(
    paymentPayoutAccount,
    'isVerificationRequired'
  );

  const { addToast } = useToasts();
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleError = (error) => {
    const errorMessage = getErrorMessage(
      error,
      `An error occurred while removing the ${selectedMethod.type} method`
    );
    addToast(errorMessage, {
      appearance: 'error'
    });
    hideRemovePaymentMethodConfirmation();
    setSelectedMethod(null);
  };
  const handleCompleted = () => {
    addToast(`The ${selectedMethod.type} method has been removed`, {
      appearance: 'success',
      autoDismiss: true,
      autoDismissTimeout: 3000,
      onDismiss: router.reload
    });
    hideRemovePaymentMethodConfirmation();
    setSelectedMethod(null);
  };

  const [
    removePaymentMethod,
    { loading: isRemovingPaymentMethod }
  ] = useMutation(REMOVE_PAYMENT_METHOD, {
    onError: handleError,
    onCompleted: handleCompleted
  });
  const [removePayoutMethod, { loading: isRemovingPayoutMethod }] = useMutation(
    REMOVE_PAYOUT_METHOD,
    {
      onError: handleError,
      onCompleted: handleCompleted
    }
  );

  const handleRemovePaymentMethod = () => {
    if (selectedMethod.type === 'payment') {
      removePaymentMethod({
        variables: {
          where: {
            paymentMethodId: selectedMethod.id
          }
        }
      });
      return;
    }
    removePayoutMethod({
      variables: {
        where: {
          paymentMethodId: selectedMethod.id
        }
      }
    });
  };

  const [
    showRemovePaymentMethodConfirmation,
    hideRemovePaymentMethodConfirmation
  ] = useModal(
    () => (
      <ConfirmationModal
        onClose={hideRemovePaymentMethodConfirmation}
        title={`Remove ${selectedMethod.type} method?`}
        onContinue={handleRemovePaymentMethod}
        continueButtonLabel={'Yes, remove this'}
        cancelButtonLabel={'Nope'}
        isSubmitting={
          selectedMethod.type === 'payment'
            ? isRemovingPaymentMethod
            : isRemovingPayoutMethod
        }
      >
        <div>Are you sure you want to remove this payment method?</div>
      </ConfirmationModal>
    ),
    [selectedMethod]
  );

  const handleVerifyAccountCancel = () => {
    addToast("User couldn't be verified", {
      appearance: 'error',
      autoDismiss: true
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

  const [showPaymentMethodModal, hidePaymentMethodModal] = useModal(
    () => <PaymentMethodModal onClose={hidePaymentMethodModal} user={user} />,
    [user]
  );
  const [showPayoutMethodModal, hidePayoutMethodModal] = useModal(
    () => (
      <PayoutMethodModal
        onClose={hidePayoutMethodModal}
        user={user}
        showConfirmVerificationModal={showVerifyPayoutAccountModal}
      />
    ),
    [user, showVerifyPayoutAccountModal]
  );

  const handleRemoveClick = ({ type, id }) => {
    setSelectedMethod({
      type,
      id
    });

    showRemovePaymentMethodConfirmation();
  };

  const handleAddMethodClick = ({ type }) => {
    if (type === 'payment') {
      if (isEmpty(paymentMethods)) {
        return showPaymentMethodModal();
      }
      return addToast(`You can't add more than 1 ${type} method`, {
        appearance: 'info'
      });
    }

    if (isEmpty(payoutMethods)) {
      return showPayoutMethodModal();
    }
    return addToast(`You can't add more than 1 ${type} method`, {
      appearance: 'info'
    });
  };

  return (
    <Wrapper>
      <div>
        <Title>Payment Methods</Title>
        {!isEmpty(paymentMethods) && (
          <MethodWrapper>
            {paymentMethods.map((paymentMethod) => {
              const { source } = paymentMethod;
              return (
                <Method key={paymentMethod.id}>
                  <CardDetails source={source} />

                  <CrossIcon
                    css={removeButtonStyles}
                    onClick={() =>
                      handleRemoveClick({
                        type: 'payment',
                        id: paymentMethod.id
                      })
                    }
                  />
                </Method>
              );
            })}
          </MethodWrapper>
        )}
        <CTAButton onClick={() => handleAddMethodClick({ type: 'payment' })}>
          Add payment method
        </CTAButton>
      </div>

      <div>
        <Title>
          Payout Methods
          {isVerificationRequired && (
            <VerifyButton onClick={showVerifyPayoutAccountModal}>
              Verify user
            </VerifyButton>
          )}
        </Title>
        {isVerificationRequired && (
          <Restricted>
            <RestrictedIcon />
            {`We can't process payouts until you verify yourself.`}
          </Restricted>
        )}

        {!isEmpty(payoutMethods) && (
          <MethodWrapper>
            {payoutMethods.map((paymentMethod) => {
              const { source } = paymentMethod;
              return (
                <Method key={paymentMethod.id}>
                  <CardDetails source={source} />

                  <CrossIcon
                    css={removeButtonStyles}
                    onClick={() =>
                      handleRemoveClick({
                        type: 'payout',
                        id: paymentMethod.id
                      })
                    }
                  />
                </Method>
              );
            })}
          </MethodWrapper>
        )}
        <CTAButton onClick={() => handleAddMethodClick({ type: 'payout ' })}>
          Add payout method
        </CTAButton>
      </div>
    </Wrapper>
  );
};

PaymentDetails.propTypes = {
  user: PropTypes.shape({
    paymentMethods: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        source: PropTypes.shape({
          brand: PropTypes.string.isRequired,
          last4: PropTypes.string.isRequired
        })
      })
    ),
    paymentPayoutAccount: PropTypes.shape({
      paymentMethods: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          source: PropTypes.shape({
            brand: PropTypes.string.isRequired,
            last4: PropTypes.string.isRequired
          })
        })
      )
    })
  }).isRequired
};

export default PaymentDetails;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  margin-top: ${rem(30)};

  > div {
    margin-top: ${rem(40)};
  }
`;

const Title = styled.div`
  color: ${theme.colors.links};
  font-size: ${rem(22)};

  display: flex;
  align-items: center;
`;

const MethodWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${rem(10)};

  > div {
    margin-left: ${rem(10)};
  }
  > div:first-child {
    margin-left: 0;
  }
`;

const CardBrandWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Method = styled.div`
  ${boxBorder};

  display: flex;
  align-items: center;
  padding: ${rem(2)} ${rem(10)};

  ${CardBrandWrapper} {
    svg {
      height: ${rem(35)};
      width: ${rem(35)};
      display: inline;
      margin: 0 ${rem(6)} 0 ${rem(2)};
    }
  }
`;

const Text = styled.span`
  color: #6d7b86;
  margin: 0 ${rem(2)};
  font-size: ${rem(15)};
  b {
    color: #24292e;
    font-weight: normal;
  }
`;

const CTAButton = styled.button`
  ${buttonWhite};
  ${buttonRounded};
  padding: ${rem(8)} ${rem(12)};
  font-size: ${rem(15)};
  margin-top: ${rem(10)};
`;

const removeButtonStyles = css`
  color: ${theme.colors.error};
  width: ${rem(15)};
  height: ${rem(15)};
  margin-left: ${rem(10)};
  position: relative;
  top: -1px;
  cursor: pointer;

  transition: all 0.3s;
  :hover {
    transform: scale(1.2);
  }
  :active {
    transform: scale(0.9);
  }
  :disabled:hover,
  :disabled:active {
    transform: scale(1);
  }
`;

const Restricted = styled.div`
  font-size: ${rem(14)};
  color: ${theme.colors.error};
  margin-bottom: ${rem(15)};

  svg {
    width: ${rem(14)};
    height: ${rem(14)};
    position: relative;
    top: 2px;
    margin-right: ${rem(5)};
  }
`;

const VerifyButton = styled.button`
  ${buttonWhite};
  ${buttonRounded};
  font-size: ${rem(14)};
  margin-left: ${rem(8)};
  padding: ${rem(4)} ${rem(6)};

  position: relative;
  top: -1px;
`;
