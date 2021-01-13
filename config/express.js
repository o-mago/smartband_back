const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = () => {
  const app = express();

  app.set('port', process.env.API_PORT);

  app.use(bodyParser.json());

  app.use(cors());

  require('../api/routes/addData')(app);
  require('../api/routes/status')(app);

  return app;
};