require('dotenv').config({});
const convict = require('convict');

const { NODE_ENV = 'development' } = process.env;

module.exports = convict({
  env: {
    isProduction: {
      format: Boolean,
      default: false
    },
    isDevelopment: {
      format: Boolean,
      default: false
    },
    isTest: {
      format: Boolean,
      default: false
    }
  },
  port: {
    doc: 'The port to listen to incoming http requests.',
    format: 'port',
    default: 5000,
    env: 'PORT'
  },
  enable: {
    playground: {
      doc: 'Enable GraphQL playground.',
      format: Boolean,
      default: false,
      env: 'ENABLE_PLAYGROUND'
    },
    frontend: {
      doc: 'Enable nextjs.',
      format: Boolean,
      default: true,
      env: 'ENABLE_FRONTEND'
    },
    backend: {
      doc: 'Enable GraphQL.',
      format: Boolean,
      default: true,
      env: 'ENABLE_BACKEND'
    }
  },
  firebase: {
    credentials: {
      doc: 'Firebase credentials secret.',
      format: Object,
      default: null,
      required: true,
      env: 'FIREBASE_CREDENTIALS'
    },
    webapiKey: {
      doc: 'Firebase webapi key secret.',
      format: String,
      default: '',
      env: 'FIREBASE_WEBAPI_KEY'
    },
    database: {
      url: {
        doc: 'Firebase databse URL (firestore).',
        format: String,
        default: '',
        env: 'FIREBASE_DATABASE_URL'
      }
    }
  }
})
  .load({
    env: {
      isProduction: NODE_ENV === 'production',
      isDevelopment: NODE_ENV === 'development',
      isTest: NODE_ENV === 'test'
    }
  })
  .validate({ strict: true });
