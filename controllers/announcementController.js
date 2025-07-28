const announcementService = require('../services/announcementService');

/**
 * @description 公告控制器
 * @module controllers/announcementController
 */

/**
 * @description 获取公告列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 公告列表及分页信息
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


/**
 * @description 更新公告接口
 * @param {Object} req - 请求对象
 * @param {number} req.params.id - 公告ID
 * @param {Object} req.body - 更新数据
 * @returns {Promise<Object>} 更新后的公告信息
 */
exports.updateAnnouncement = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        const updateData = req.body;
        const updatedAnnouncement = await announcementService.updateAnnouncement(id, updateData);
        return res.success(updatedAnnouncement, '更新成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};
