const express = require('express');
const router = express.Router();
const permissionGuard = require('../middlewares/permissionGuard');
const replayController = require('../controllers/replayController.js');
/**
 * @description 课程回放路由
 * @module routes/replay
 */

// 获取课程回放列表
router.get('/', replayController.getReplays);

// 获取课程回放详情
router.get('/:id', replayController.getReplayDetail);

// 获取当前用户发布的所有课程回放
router.get('/self', replayController.getCurrentUserReplays);

// 添加课程回放
router.post('/', permissionGuard({ type: 'replay', action: 'add', minLevel: 3 }), replayController.addReplay);

// 更新课程回放
router.put('/:id', permissionGuard({ type: 'replay', action: 'update', minLevel: 3 }), replayController.updateReplay);

// 删除课程回放
router.delete('/', permissionGuard({ type: 'replay', action: 'delete', minLevel: 3 }), replayController.deleteReplay);

module.exports = router;