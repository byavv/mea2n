switch (process.env.NODE_ENV) {
  case 'test':
    module.exports = require('./webpack.server.test');
    break;
  case 'development':
  default:
    module.exports = require('./webpack.server.development');
}
