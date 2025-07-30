const express = require('express');
const router = express.Router();
const replayController = require('../controllers/replayController.js');
/**
 * @description 课程回放路由
 * @module routes/replay
 */

// 获取课程回放列表
router.get('/', replayController.getReplays);
// 添加课程回放
router.post('/addReplay', replayController.addReplay);
// 更新课程回放
router.put('/:id', replayController.updateReplay);
// 删除课程回放
router.delete('/:id', replayController.deleteReplay);

module.exports = router;