import { css } from '@emotion/core';

const fonts = css`
  /* Define "DIN Next LT Pro" font */

  // light
  @font-face {
    font-family: 'DIN Next LT Pro';
    src: url('/fonts/DINNextLTPro-Light.eot');
    src: local('DIN Next LT Pro Light'), local('DINNextLTPro-Light'),
      url('/fonts/DINNextLTPro-Light.eot?#iefix') format('embedded-opentype'),
      url('/fonts/DINNextLTPro-Light.woff') format('woff'),
      url('/fonts/DINNextLTPro-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
  }
  // regular
  @font-face {
    font-family: 'DIN Next LT Pro';
    src: url('/fonts/DINNextLTPro-Regular.ttf');
    src: local('DIN Next LT Pro Regular'), local('DINNextLTPro-Regular'),
      url('/fonts/DINNextLTPro-Regular.eot?#iefix') format('embedded-opentype'),
      url('/fonts/DINNextLTPro-Regular.woff') format('woff'),
      url('/fonts/DINNextLTPro-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  // medium
  @font-face {
    font-family: 'DIN Next LT Pro';
    src: url('/fonts/DINNextLTPro-Medium.eot');
    src: local('DIN Next LT Pro Medium'), local('DINNextLTPro-Medium'),
      url('/fonts/DINNextLTPro-Medium.eot?#iefix') format('embedded-opentype'),
      url('/fonts/DINNextLTPro-Medium.woff') format('woff'),
      url('/fonts/DINNextLTPro-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }
  // bold
  @font-face {
    font-family: 'DIN Next LT Pro';
    src: url('/fonts/DINNextLTPro-Bold.eot');
    src: local('DIN Next LT Pro Bold'), local('DINNextLTPro-Bold'),
      url('/fonts/DINNextLTPro-Bold.eot?#iefix') format('embedded-opentype'),
      url('/fonts/DINNextLTPro-Bold.woff') format('woff'),
      url('/fonts/DINNextLTPro-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }
  // italic
  @font-face {
    font-family: 'DIN Next LT Pro';
    src: url('/fonts/DINNextLTPro-Italic.eot');
    src: local('DIN Next LT Pro Italic'), local('DINNextLTPro-Italic'),
      url('/fonts/DINNextLTPro-Italic.eot?#iefix') format('embedded-opentype'),
      url('/fonts/DINNextLTPro-Italic.woff') format('woff'),
      url('/fonts/DINNextLTPro-Italic.ttf') format('truetype');
    font-weight: normal;
    font-style: italic;
  }
  // heavy bold - italic
  @font-face {
    font-family: 'DIN Next LT Pro';
    src: url('/fonts/DINNextLTPro-BlackItalic.eot');
    src: local('DIN Next LT Pro Black Italic'),
      local('DINNextLTPro-BlackItalic'),
      url('/fonts/DINNextLTPro-BlackItalic.eot?#iefix')
        format('embedded-opentype'),
      url('/fonts/DINNextLTPro-BlackItalic.woff') format('woff'),
      url('/fonts/DINNextLTPro-BlackItalic.ttf') format('truetype');
    font-weight: 900;
    font-style: italic;
  }
`;

export default fonts;
