const announcementService = require('../services/announcementService');

exports.getAnnouncements = async (req, res, next) => {
    try {
        const result = await announcementService.getAnnouncements(req.query);
        if (!result.announcements || result.announcements.length === 0) {
            return res.json({ message: '没有查询到相关文章', data: result });
        }
        return res.json({ message: '查询成功', data: result });
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};