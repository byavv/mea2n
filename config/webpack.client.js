switch (process.env.NODE_ENV) {
  case 'production':
    module.exports = require('./webpack.client.production');
    break;
  case 'test':
    module.exports = require('./webpack.client.test');
    break;
  case 'development':
  default:
    module.exports = require('./webpack.client.development');
}