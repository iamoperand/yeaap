import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

const defaultAvatar = '/images/avatar.png';

const Avatar = ({ src, alt = 'Avatar image not found' }) => {
  let imageSource = src;
  if (isEmpty(imageSource)) {
    imageSource = defaultAvatar;
  }

  return <img src={imageSource} alt={alt} />;
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string
};

export default Avatar;
