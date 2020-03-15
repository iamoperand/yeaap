import React from 'react';
import styled from '@emotion/styled';

import rem from '../utils/rem';

const Loading = () => {
  return (
    <Center>
      <Img src="/images/loading.gif" alt="loading" />
    </Center>
  );
};

/*
 ********************************************
 styled components
 ********************************************
 */

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  width: ${rem(100)};
  height: ${rem(100)};
`;

export default Loading;
