import React from 'react';
import PropTypes from 'prop-types';
import { lowerCase } from 'lodash';

import AmexIcon from '../../assets/icons/cards/amex.svg?sprite';
import DinersIcon from '../../assets/icons/cards/diners.svg?sprite';
import DiscoverIcon from '../../assets/icons/cards/discover.svg?sprite';
import JCBIcon from '../../assets/icons/cards/jcb.svg?sprite';
import MastercardIcon from '../../assets/icons/cards/mastercard.svg?sprite';
import UnionpayIcon from '../../assets/icons/cards/unionpay.svg?sprite';
import VisaIcon from '../../assets/icons/cards/visa.svg?sprite';
import GenericIcon from '../../assets/icons/cards/generic.svg?sprite';

const CardBrand = ({ brand }) => {
  switch (lowerCase(brand)) {
    case 'amex':
      return <AmexIcon />;
    case 'diners':
      return <DinersIcon />;
    case 'discover':
      return <DiscoverIcon />;
    case 'jcb':
      return <JCBIcon />;
    case 'mastercard':
      return <MastercardIcon />;
    case 'unionpay':
      return <UnionpayIcon />;
    case 'visa':
      return <VisaIcon />;
    case 'unknown':
      return <GenericIcon />;
    default:
      return <GenericIcon />;
  }
};

CardBrand.propTypes = {
  brand: PropTypes.string.isRequired
};

export default CardBrand;
