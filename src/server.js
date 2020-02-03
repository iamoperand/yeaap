const { ary, startsWith, trimStart } = require('lodash');
const http = require('http');
const createExpressApp = require('express');
const createNextApp = require('next');
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

const handleRedirects = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'http') {
    res
      .status(301)
      .set('Location', 'https://' + req.headers.host + req.url)
      .end();
  } else if (startsWith(req.headers.host, 'www.')) {
    const host = trimStart(req.headers.host, 'www.');

    res
      .status(301)
      .set('Location', 'https://' + host + req.url)
      .end();
  } else {
    next();
  }
};

const attachNext = (app, handler) => {
  app.use(handleRedirects).all('*', ary(handler, 2));
};

const app = createNextApp({ dev: !config.get('env').isProduction });

app.prepare().then(() => {
  const expressApp = createExpressApp();
  const httpServer = http.createServer(expressApp);

  attachApi(expressApp, httpServer);
  attachNext(expressApp, app.getRequestHandler());

  httpServer.listen(config.get('port'), handleListen);
});
