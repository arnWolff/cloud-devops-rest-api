const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'cloud-devops-rest API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/arnWolff/cloud-devops-rest-api/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `https://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
