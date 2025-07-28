const express = require('express');
const router = express.Router();
const replayController = require('../controllers/replayController.js');

// 获取课程回放列表
router.get('/', replayController.getReplays);

module.exports = router;