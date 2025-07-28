const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController.js');

// 获取公告列表
router.get('/', announcementController.getAnnouncements);

module.exports = router;