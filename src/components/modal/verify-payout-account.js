import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import getConfig from 'next/config';
import { useToasts } from 'react-toast-notifications';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';

import ConfirmationModal from './confirmation';

import rem from '../../utils/rem';
import { openPopup, pollPopup } from '../../utils/popup';
import { getErrorMessage } from '../../utils/error';

const VERIFY_PAYOUT_ACCOUNT = gql`
  mutation($input: CreatePaymentPayoutAccountOnboardingLinkDataInput!) {
    createPaymentPayoutAccountOnboardingUrl(data: $input)
  }
`;

const { publicRuntimeConfig } = getConfig();
const { appUrl } = publicRuntimeConfig;

const failureRedirectUrl = `${appUrl}/user-verification?status=failure`;
const successRedirectUrl = `${appUrl}/user-verification?status=success`;

// eslint-disable-next-line max-lines-per-function
const VerifyPayoutAccount = ({ onClose, onCancel }) => {
  const { addToast } = useToasts();
  const router = useRouter();

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

  const [verifyPayoutAccount, { loading: isVerifyingAccount }] = useMutation(
    VERIFY_PAYOUT_ACCOUNT,
    {
      onError: (error) => {
        const errorMessage = getErrorMessage(
          error,
          'An error occurred while verifying the user'
        );
        addToast(errorMessage, {
          appearance: 'error',
          autoDismiss: true
        });

        onClose();
      },
      onCompleted: ({ createPaymentPayoutAccountOnboardingUrl: url }) => {
        if (!url) {
          addToast(`Invalid URL sent by stripe.`, {
            appearance: 'error',
            autoDismiss: true,
            autoDismissTimeout: 3000,
            onDismiss: router.reload
          });
          onClose();
          return;
        }

        const popup = openPopup({ url });
        pollPopup(popup, {
          pollTimeout: 2000,
          successUrl: successRedirectUrl,
          failureUrl: failureRedirectUrl,
          onSuccess: () => {
            addToast(
              `Thankyou for taking the time to go through the verification process.`,
              {
                appearance: 'info',
                autoDismiss: true,
                autoDismissTimeout: 3000,
                onDismiss: router.reload
              }
            );

            onClose();
          },
          onFailure: (message) => {
            addToast(message, {
              appearance: 'error',
              autoDismiss: true,
              autoDismissTimeout: 3000,
              onDismiss: router.reload
            });

            onClose();
          }
        });
      }
    }
  );

  return (
    <ConfirmationModal
      onClose={onClose}
      title="Verify user"
      onContinue={handleContinue}
      onCancel={onCancel}
      continueButtonLabel="Verify user"
      isSubmitting={isVerifyingAccount}
    >
      <Text>
        {`Stripe needs to verify the user in order to carry out smooth out-flow
          of payments. This won't take long, I promise!`}
      </Text>
    </ConfirmationModal>
  );
};

VerifyPayoutAccount.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default VerifyPayoutAccount;

/*
 ********************************************
 styled components
 ********************************************
 */

const Text = styled.div`
  margin-bottom: ${rem(5)};
  :last-child {
    margin-bottom: 0;
  }
`;
