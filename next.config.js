const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const withPlugins = require('next-compose-plugins');
const optimizedFonts = require('next-fonts');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  {
    webpack: (config, { webpack }) => {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': dotenv.parsed
        })
      );

      return config;
    }
  },
  optimizedFonts,
  optimizedImages
]);
