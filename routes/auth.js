const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 修正拼写

// 跳转casdoor登录页面
router.get('/login', authController.getLoginUrl);

// 处理casdoor登录回调
router.post('/callback', authController.handelCallback);

module.exports = router;

