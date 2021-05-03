const login = require('../controllers/login');

module.exports = app => {
  app.route('/api/v1/login')
    .post(login);
}