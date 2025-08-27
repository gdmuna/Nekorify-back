const express = require('express');
const router = express.Router();
const permissionGuard = require('../middlewares/permissionGuard');
const taskController = require('../controllers/taskController');

/**
 * @description 任务路由
 * @module routes/task
 */

// 获取任务列表
router.get('/', taskController.getTasks);
// 新增任务
router.post('/', permissionGuard({ type: 'task', action: 'add', minLevel: 2 }), taskController.createTask);
// 修改任务
router.put('/:id', permissionGuard({ type: 'task', action: 'update', minLevel: 2 }), taskController.updateTask);
// 删除任务
router.delete('/:id', permissionGuard({ type: 'task', action: 'delete', minLevel: 2 }), taskController.deleteTask);

module.exports = router;