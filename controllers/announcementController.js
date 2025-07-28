const announcementService = require('../services/announcementService');
/**
 * @description 公告控制器
 * @module controllers/announcementController
 */

exports.getAnnouncements = async (req, res, next) => {
    try {
        const result = await announcementService.getAnnouncements(req.query);
        if (!result.announcements || result.announcements.length === 0) {
            return res.success(result, '没有查询到相关公告', 'NO_ANNOUNCEMENT');
        }
        return res.success(result, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};