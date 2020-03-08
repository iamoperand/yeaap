import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

import rem from '../utils/rem';

const Footer = () => {
  return (
    <Wrapper>
      <Links>
        <Link href="/about" passHref>
          <Anchor>About</Anchor>
        </Link>
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
      <Copywright>{'© 2020 Yeaap!'}</Copywright>
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

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Anchor = styled.a`
  margin: 0 ${rem(10)};

  :first-child {
    margin-left: 0;
  }
  :last-child {
    margin-right: 0;
  }
`;

const Copywright = styled.div``;
