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
 * @description 修改公告接口
 * @param {Object} req - 请求对象
 * @param {number} req.params.id - 公告ID
 * @param {Object} req.body - 更新数据
 * @param {string} [req.body.title] - 公告标题（可选）
 * @param {string} [req.body.cover_url] - 公告封面URL（可选）
 * @param {string} [req.body.author] - 公告作者（可选）
 * @param {string} [req.body.department] - 发布部门（可选）
 * @param {string} [req.body.text_md_url] - 公告Markdown文本URL（可选）
 * @returns {Promise<Object>} 更新后的公告信息
 */
exports.updateAnnouncement = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        const updateData = req.body;
        const result = await announcementService.updateAnnouncement(announcementId, updateData);
        return res.success(result, '公告更新成功', 'ANNOUNCEMENT_UPDATED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};


/**
 * @description 删除公告接口
 * @param {Object} req - 请求对象
 * @param {number} req.params.id - 公告ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        const result = await announcementService.deleteAnnouncement(announcementId);
        return res.success(result, '公告删除成功', 'ANNOUNCEMENT_DELETED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};


/**
 * @description 新增公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.body - 公告数据
 * @param {string} req.body.title - 公告标题 (必填)
 * @param {string} [req.body.cover_url] - 公告封面URL (可选)
 * @param {string} [req.body.author] - 公告作者 (必填)
 * @param {string} [req.body.department] - 发布部门 (必填)
 * @param {string} [req.body.text_md_url] - 公告Markdown文本URL (必填)
 * @returns {Promise<Object>} 新增的公告信息
 */
exports.createAnnouncement = async (req, res, next) => {
    try {
        const announcementData = req.body;
        const result = await announcementService.createAnnouncement(announcementData);
        return res.success(result, '公告新增成功', 'ANNOUNCEMENT_CREATED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};