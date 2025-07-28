const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const announcementController = require('../controllers/announcementController.js');

// 获取所有公告
router.get('/getAll', announcementController.getAllAnnouncements);

module.exports = router;