const config = require('./src/config');

const { isDevelopment } = config.get('env');

module.exports = {
  presets: [
    'next/babel',
    [
      '@emotion/babel-preset-css-prop',
      {
        autoLabel: isDevelopment,
        labelFormat: '[local]-[filename]',
        cssPropOptimization: true
      }
    ]
  ],
  plugins: []
};
