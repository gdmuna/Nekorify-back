const express = require('express');
const router = express.Router();
const replayController = require('../controllers/replayController.js');
/**
 * @description 课程回放路由
 * @module routes/replay
 */

// 获取课程回放列表
router.get('/', replayController.getReplays);

module.exports = router;