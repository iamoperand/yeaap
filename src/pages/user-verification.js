import React from 'react';
import { useRouter } from 'next/router';
import { get, eq } from 'lodash';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Layout from '../components/layout';
import SEO from '../components/seo';
import CheckIcon from '../assets/icons/check.svg?sprite';
import CancelIcon from '../assets/icons/cancel.svg?sprite';
import QuestionIcon from '../assets/icons/question.svg?sprite';

import rem from '../utils/rem';

const UserVerification = () => {
  const { query } = useRouter();

  const status = get(query, 'status');
  const isStatusUnknown = !(eq(status, 'success') || eq(status, 'failed'));

  return (
    <Layout>
      <SEO title="User verification" />
      <Center>
        {eq(status, 'success') && (
          <>
            <CheckIcon css={iconStyles} />
            <Title>Thankyou!</Title>
            <Line>We appreciate your time.</Line>
          </>
        )}
        {eq(status, 'failed') && (
          <>
            <CancelIcon css={iconStyles} />
            <Title>Crap!</Title>
            <Line>{'Verification failed.'}</Line>
          </>
        )}
        {isStatusUnknown && (
          <>
            <QuestionIcon css={iconStyles} />
            <Title>Waht?</Title>
            <Line>{'What just happened here?'}</Line>
          </>
        )}
      </Center>
    </Layout>
  );
};

export default UserVerification;

/*
 ********************************************
 styled components
 ********************************************
 */

const iconStyles = css`
  width: ${rem(150)};
  height: ${rem(150)};
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  margin-top: ${rem(50)};
`;

const Line = styled.div`
  font-size: ${rem(22)};
  text-align: center;
  color: #6a6e71;
  margin: 0 auto;
  width: ${rem(300)};
`;

const Title = styled.div`
  font-size: ${rem(70)};
  text-align: center;
  color: #5a5e64;
  margin-bottom: ${rem(10)};
  font-weight: 500;
  margin-top: ${rem(40)};
`;
