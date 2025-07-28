const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
/**
 * @description 消息路由
 * @module routes/message
 */

// 获取消息列表
router.get('/:stuId', messageController.getMessages);
router.get('/', messageController.getMessages);


module.exports = router;