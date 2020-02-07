const withPlugins = require('next-compose-plugins');
const optimizedFonts = require('next-fonts');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([optimizedFonts, optimizedImages]);
