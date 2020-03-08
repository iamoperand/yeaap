import theme from '../utils/theme';

const STYLE_OPTIONS = {
  base: {
    fontWeight: 300,
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    fontSize: '15px',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#ccc'
    },
    ':-webkit-autofill': {
      color: theme.colors.links
    }
  },
  invalid: {
    color: 'inherit'
  }
};

export const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: STYLE_OPTIONS
};
