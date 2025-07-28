const { success, failure } = require('../utils/resopnses');

const announcementService = require('../services/announcementService');

exports.getAllAnnouncements = async (req, res) => {
    try {
        const result = await announcementService.getAllAnnouncements(req.query);
        if (!result.announcements || result.announcements.length === 0) {
            return success(res, '没有查询到相关公告', [result]);
        }
        return success(res, '查询成功', result);
    } catch (err) {
        return failure(res, { message: err.message });
    }
};