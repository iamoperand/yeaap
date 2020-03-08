import { css } from '@emotion/core';

const fonts = css`
  /* Define "TTCommons" font */

  // light
  @font-face {
    font-family: 'TTCommons';
    src: url('/fonts/TTCommons-Light.ttf');
    font-weight: 300;
    font-style: normal;
  }
  // regular
  @font-face {
    font-family: 'TTCommons';
    src: url('/fonts/TTCommons-Regular.ttf');
    font-weight: normal;
    font-style: normal;
  }
  // medium
  @font-face {
    font-family: 'TTCommons';
    src: url('/fonts/TTCommons-Medium.ttf');
    src: local('TTCommons Medium'), local('DINNextLTPro-Medium'),
      url('/fonts/DINNextLTPro-Medium.eot?#iefix') format('embedded-opentype'),
      url('/fonts/DINNextLTPro-Medium.woff') format('woff'),
      url('/fonts/DINNextLTPro-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }
  // bold
  @font-face {
    font-family: 'TTCommons';
    src: url('/fonts/TTCommons-DemiBold.ttf');
    font-weight: bold;
    font-style: normal;
  }
  // italic
  @font-face {
    font-family: 'TTCommons';
    src: url('/fonts/TTCommons-Italic.ttf');
    font-weight: normal;
    font-style: italic;
  }
  // italic
  @font-face {
    font-family: 'TTCommons';
    src: url('/fonts/TTCommons-DemiBoldItalic.ttf');
    font-weight: bold;
    font-style: italic;
  }
`;

export default fonts;
