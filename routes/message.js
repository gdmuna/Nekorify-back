const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
/**
 * @description 消息路由
 * @module routes/message
 */

// 获取消息列表
router.get('/:user_id', messageController.getMessages);

module.exports = router;