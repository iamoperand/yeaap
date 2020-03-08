import { find, has, transform } from 'lodash';

const addressTypes = {
  administrative_area_level_1: 'administrative_area_level_1',
  locality: 'locality',
  country: 'country',
  postal_code: 'postal_code'
};

const transformComponents = (addressComponents) =>
  addressComponents.reduce((final, address) => {
    const { types } = address;

    const matchedType = find(types, (type) => has(addressTypes, type));
    if (!matchedType) {
      return final;
    }

    const matchedAddressType = addressTypes[matchedType];
    const hasLongName = matchedAddressType === 'country' ? false : true;
    return {
      ...final,
      [matchedAddressType]: hasLongName ? address.long_name : address.short_name
    };
  }, {});

const addressMap = {
  address_state: 'administrative_area_level_1',
  address_city: 'locality',
  address_country: 'country',
  address_zip: 'postal_code'
};

const mapAddress = (address) =>
  transform(addressMap, (final, value, key) => {
    final[key] = address[value];
  });

export const getAddress = (addressComponents) =>
  mapAddress(transformComponents(addressComponents));

export const validateAddress = (address) => {
  // country is needed
  if (address.address_country) {
    return true;
  }
  return false;
};
