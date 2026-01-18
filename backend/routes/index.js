const admin = require('./adminRoutes');
const airport = require('./airportRoutes');
const airline = require('./airlineRoutes');
const flight = require('./flightRoutes');
const message = require('./messageRoutes');
const screen = require('./screenRoutes');
const messageTemplate = require('./messageTemplateRoutes');
const setting = require('./settingRoutes');
const translation = require('./translationRoutes');

const initWebRoutes = (app) => {
  app.use('/api/v1/admin', admin);
  app.use('/api/v1/airport', airport);
  app.use('/api/v1/airline', airline);
  app.use('/api/v1/flight', flight);
  app.use('/api/v1/message', message);
  app.use('/api/v1/screen', screen);
  app.use('/api/v1/message-template', messageTemplate);
  app.use('/api/v1/setting', setting);
  app.use('/api/v1/translation', translation);
};

module.exports = initWebRoutes;
