const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController.js');

/**
 * @description 公告路由
 * @module routes/announcement
 */

// 获取公告列表
router.get('/', announcementController.getAnnouncements);
// 更新公告
router.put('/:id', announcementController.updateAnnouncement);

module.exports = router;