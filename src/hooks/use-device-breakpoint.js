import useBreakpoint from 'use-breakpoint';
import { mapValues } from 'lodash';

import theme from '../utils/theme';

const breakpointConfig = mapValues(theme.breakpoints, (breakpoint) =>
  parseInt(breakpoint.replace('px', ''))
);

const useDeviceBreakpoint = () => {
  const { breakpoint, maxWidth, minWidth } = useBreakpoint(
    breakpointConfig,
    'desktop'
  );

  return { breakpoint, maxWidth, minWidth };
};

export default useDeviceBreakpoint;
