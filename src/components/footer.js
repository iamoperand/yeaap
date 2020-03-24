import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

import rem from '../utils/rem';
import theme from '../utils/theme';

const Footer = () => {
  return (
    <Wrapper>
      <Links>
        <Link href="/help" passHref>
          <Anchor>Help</Anchor>
        </Link>
        <Link href="/privacy" passHref>
          <Anchor>Privacy</Anchor>
        </Link>
        <Link href="/terms" passHref>
          <Anchor>Terms of service</Anchor>
        </Link>
        <Link href="/feedback" passHref>
          <Anchor>Feedback</Anchor>
        </Link>
      </Links>
      <Copywright>{'© 2020 yeaap.co'}</Copywright>
    </Wrapper>
  );
};

export default Footer;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.footer`
  align-self: center;

  display: grid;
  grid-template-areas: 'links' 'copyright';
  justify-content: center;
  grid-gap: ${rem(20)} 0;

  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    grid-template-areas: 'links copyright';
    align-items: center;
    justify-content: space-between;
  }
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Anchor = styled.a`
  margin: ${rem(6)} ${rem(10)};

  :first-child {
    margin-left: 0;
  }
  :last-child {
    margin-right: 0;
  }
`;

const Copywright = styled.div`
  text-align: center;
  @media screen and (min-width: ${theme.breakpoints.tablet}) {
    text-align: left;
  }
`;
