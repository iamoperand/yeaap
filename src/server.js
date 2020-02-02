const { ary } = require('lodash');
const http = require('http');
const express = require('express');
const next = require('next');
const { attachApi } = require('./api');
const config = require('./config');

const handleListen = (err) => {
  if (err) {
    console.error('error during startup:', err);
    process.exit(1);
  } else {
    console.log('server ready on port:', config.get('port'));
  }
};

const attachNext = (app, handler) => {
  app.all('*', ary(handler, 2));
};

const app = next({ dev: !config.get('env').isProduction });

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = http.createServer(expressApp);

  attachApi(expressApp, httpServer);
  attachNext(expressApp, app.getRequestHandler());

  httpServer.listen(config.get('port'), handleListen);
});
