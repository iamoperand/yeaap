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
  enablePlayground: {
    doc: 'Enable GraphQL playground.',
    format: Boolean,
    default: false,
    env: 'ENABLE_PLAYGROUND'
  },
  firebase: {
    credentials: {
      doc: 'Firebase credentials secret.',
      format: Object,
      default: null,
      required: true,
      env: 'FIREBASE_CREDENTIALS'
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
