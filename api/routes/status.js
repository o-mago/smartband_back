const status = require('../controllers/status');

module.exports = app => {
  app.route('/api/v1/status')
    .get(status);
}