const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// 获取任务列表
router.get('/', taskController.getTasks);

module.exports = router;