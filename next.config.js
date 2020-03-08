const withPlugins = require('next-compose-plugins');
const optimizedFonts = require('next-fonts');
const optimizedImages = require('next-optimized-images');
const config = require('./src/config');

module.exports = withPlugins([
  {
    publicRuntimeConfig: {
      firebaseAppConfig: config.get('firebase').app.config,
      stripePublishableKey: config.get('stripe').publishableKey,
      googleMapsKey: config.get('maps'),
      apiUrl: config.get('apiUrl'),
      appUrl: config.get('appUrl')
    }
  },
  optimizedFonts,
  optimizedImages
]);
