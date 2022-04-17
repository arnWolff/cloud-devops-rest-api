const mongoose = require('mongoose');
// const fs = require('fs');
// const https = require('https');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const Directory = require('./utils/Directory');

// create users directory if doesn't exist
(async () => {
  await Directory.create(config.dockerVolumes_Users);
})();

// start https server
/* const sslOptions = {
  key: fs.readFileSync('./certbot/private/private.key'),
  cert: fs.readFileSync('./certbot/certificate.crt'),
}; */

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  // server = https.createServer(sslOptions, app).listen(443);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
