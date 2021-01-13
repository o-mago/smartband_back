const addData = require('../controllers/addData');

module.exports = app => {
  app.route('/api/v1/addData')
    .post(addData);
}