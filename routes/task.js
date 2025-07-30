const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @description 任务路由
 * @module routes/task
 */

// 获取任务列表
router.get('/', taskController.getTasks);
// 修改任务
router.put('/:id', taskController.updateTask);

module.exports = router;