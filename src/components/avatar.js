import React from 'react';
import PropTypes from 'prop-types';

const defaultAvatar = '/images/avatar.png';

const Avatar = ({ src = defaultAvatar, alt = 'Avatar image not found' }) => {
  let imageSource = '';

  if (src === '') {
    imageSource = defaultAvatar;
  }

  return <img src={imageSource} alt={alt} />;
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired
};

export default Avatar;
