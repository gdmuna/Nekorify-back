const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController.js');
/**
 * @description 日程路由
 * @module routes/schedule
 */

// 获取日程列表
router.get('/', scheduleController.getSchedules);

module.exports = router;