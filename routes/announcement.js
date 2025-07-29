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
// 删除公告
router.delete('/:id', announcementController.deleteAnnouncement);
// 新增公告
router.post('/', announcementController.createAnnouncement);

module.exports = router;