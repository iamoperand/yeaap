import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

import rem from '../utils/rem';
import theme from '../utils/theme';

const Header = () => {
  return (
    <Wrapper>
      <Link href="/">
        <Title>yeaap.co</Title>
      </Link>
    </Wrapper>
  );
};

export default Header;

/*
 ********************************************
 styled components
 ********************************************
 */

const Wrapper = styled.div`
  margin-top: ${rem(20)};
`;

const Title = styled.a`
  font-size: ${rem(24)};

  ::after {
    border-color: ${theme.colors.links};
  }
`;
