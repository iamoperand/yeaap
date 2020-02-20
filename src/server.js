const { ary, startsWith, trimStart } = require('lodash');
const http = require('http');
const createExpressApp = require('express');
const createNextApp = require('next');
const session = require('express-session');
const { attachApi } = require('./api');
const config = require('./config');

const handleListen = (err) => {
  if (err) {
    console.error('error during startup:', err);
    process.exit(1);
  } else {
    console.info('server ready on port:', config.get('port'));
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

const exec = async () => {
  const expressApp = createExpressApp();
  expressApp.set('trust proxy', true);
  expressApp.use(
    session({
      secret: 'geheimnis',
      saveUninitialized: true,
      resave: false,
      rolling: true,
      cookie: { maxAge: 604800000, httpOnly: true } // week
    })
  );

  const httpServer = http.createServer(expressApp);

  console.info(
    'backend:',
    config.get('enable').backend ? 'ENABLED' : 'DISABLED'
  );
  console.info(
    'frontend:',
    config.get('enable').frontend ? 'ENABLED' : 'DISABLED'
  );

  if (config.get('enable').backend) {
    attachApi(expressApp, httpServer);
  }
  if (config.get('enable').frontend) {
    const app = createNextApp({ dev: !config.get('env').isProduction });
    await app.prepare();

    attachNext(expressApp, app.getRequestHandler());
  }

  httpServer.listen(config.get('port'), handleListen);
};

exec().catch((err) => {
  console.error('Encountered runtime error. Details:');
  console.error(err.message || err);
  process.exit(1);
});
