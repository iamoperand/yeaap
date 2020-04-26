import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useToasts } from 'react-toast-notifications';
import gql from 'graphql-tag';

import Layout from '../components/layout';
import SEO from '../components/seo';
import LoadingText from '../components/loading-text';

import rem from '../utils/rem';
import { getErrorMessage } from '../utils/error';
import HelloIcon from '../assets/icons/hello-from-me.svg?sprite';
import { buttonPrimary, buttonDisabled, buttonRounded } from '../styles/button';
import { inputBasic } from '../styles/form';

const JOIN_WAITLIST = gql`
  mutation joinWaitList($data: JoinWaitListDataInput!) {
    joinWaitList(data: $data)
  }
`;

// eslint-disable-next-line max-lines-per-function
const Index = () => {
  const { addToast } = useToasts();
  const { register, handleSubmit } = useForm();
  const [joinWaitList, { loading }] = useMutation(JOIN_WAITLIST, {
    onError: (error) => {
      const errorMessage = getErrorMessage(
        error,
        'Failed to add you to the wait list.'
      );
      addToast(errorMessage, {
        appearance: 'error',
        autoDismiss: true
      });
    },
    onCompleted: () => {
      addToast(`You are now on our priority release list, yay!`, {
        appearance: 'success',
        autoDismiss: true
      });
    }
  });

  const onSubmit = (data) => {
    joinWaitList({
      variables: {
        data
      }
    });
  };

  return (
    <Layout>
      <SEO />
      <Center>
        <HelloIcon
          css={css`
            height: ${rem(200)};
            margin: 0 auto;
          `}
        />

        <HeadingWrapper>
          <div
            css={css`
              font-size: ${rem(40)};
              font-weight: 500;
            `}
          >
            Yeaap is coming
          </div>
          <div
            css={css`
              color: #6c6c6c;
              margin-top: ${rem(4)};
              font-size: ${rem(18)};
            `}
          >
            With an entirely new way to <b>host</b> and <b>join auctions</b>.
          </div>
        </HeadingWrapper>

        <CTAWrapper>
          <form
            onSubmit={handleSubmit(onSubmit)}
            css={css`
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            `}
          >
            <input
              name="email"
              type="email"
              ref={register}
              placeholder="email@yeaap.co"
              css={css`
                ${inputBasic};
                width: ${rem(270)};
              `}
              required
            />
            <CTAButton disabled={loading}>
              {loading ? <LoadingText text="Adding" /> : 'Notify me'}
            </CTAButton>
          </form>

          <div
            css={css`
              margin-top: ${rem(20)};
              color: #6c6c6c;
              font-weight: 500;
            `}
          >
            Be the first to know when we launch.
          </div>
        </CTAWrapper>
      </Center>
    </Layout>
  );
};

export default Index;

/*
 ********************************************
 styled components
 ********************************************
 */

const Center = styled.div`
  display: flex
  justify-content: center;
  text-align: center;

  margin-top: ${rem(20)}
 `;

const HeadingWrapper = styled.div`
  margin-top: ${rem(30)};
`;

const CTAWrapper = styled.div`
  margin-top: ${rem(36)};
  display: flex;
  flex-direction: column;
`;

const CTAButton = styled.button`
  ${buttonPrimary};
  ${buttonRounded};
  ${buttonDisabled};
  padding: ${rem(10)} ${rem(28)};
  margin-top: ${rem(20)};
`;
