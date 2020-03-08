import { isUndefined } from 'lodash';

export const openPopup = ({ url }) => {
  if (!url) {
    return null;
  }

  const dialogWidth = 900;
  const dialogHeight = 600;

  const left = window.screen.width / 2 - dialogWidth / 2;
  const top = window.screen.height / 2 - dialogHeight / 2;

  const popup = window.open(
    url,
    '',
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${dialogWidth}, height=${dialogHeight}, top=${top}, left=${left}`
  );

  return popup;
};

export const pollPopup = (
  popup,
  { successUrl, failureUrl, onSuccess, onFailure, pollTimeout = 3000 }
) => {
  const interval = window.setInterval(() => {
    if (!popup || popup.closed || isUndefined(popup.closed)) {
      clearInterval(interval);
      onFailure('Popup has been closed by the user');
      return;
    }

    const closeDialog = () => {
      clearInterval(interval);
      popup.close();
    };

    try {
      if (popup.location.href === failureUrl) {
        onFailure(`Verification failed. Please try again.`);
        closeDialog();
        return;
      }
      if (popup.location.href === successUrl) {
        onSuccess();
        closeDialog();
        return;
      }
    } catch (error) {
      // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
      // A hack to get around same-origin security policy errors in IE.
    }
  }, pollTimeout);
};
