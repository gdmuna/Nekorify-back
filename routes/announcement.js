const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController.js');
const permissionGuard = require('../middlewares/permissionGuard.js');

/**
 * @description 公告路由
 * @module routes/announcement
 */

// 获取公告列表
router.get('/', announcementController.getAnnouncements);
// 获取公告详情
router.get('/:id', announcementController.getAnnouncementDetail);
// 新增公告
router.post('/', permissionGuard({ type: 'announcement', action: 'add', minLevel: 2 }), announcementController.createAnnouncement);
// 删除公告
router.delete('/:id', permissionGuard({ type: 'announcement', action: 'delete', minLevel: 2 }), announcementController.deleteAnnouncement);
// 更新公告
router.put('/:id', permissionGuard({ type: 'announcement', action: 'update', minLevel: 2 }), announcementController.updateAnnouncement);

module.exports = router;