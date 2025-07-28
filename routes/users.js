var express = require('express');
var router = express.Router();
/**
 * @description 用户路由
 * @module routes/users
 */

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
