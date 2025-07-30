const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
/**
 * @description 消息路由
 * @module routes/message
 */

// 获取消息列表
router.get('/', messageController.getMessages);
// 添加消息
router.post('/sendMessage', messageController.addMessage);


module.exports = router;