const announcementService = require('../services/announcementService');
const AppError = require('../utils/AppError');
const groupMeta = require('../config/groupMeta');

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
            return res.success(result, 404, '没有查询到相关公告', 'ANNOUNCEMENT_NOT_FOUND');
        }
        return res.success(result, 200, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};


/**
 * @description 获取公告详情接口
 * @param {Object} req - 请求对象
 * @param {number} req.params.id - 公告ID
 * @returns {Promise<Object>} 公告详情
 */
exports.getAnnouncementDetail = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        if (!announcementId) {
            throw new AppError('公告不存在', 404, 'ANNOUNCEMENT_NOT_FOUND');
        }
        const result = await announcementService.getAnnouncementDetail(announcementId);
        return res.success(result, 200, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};


/**
 * @description 获取用户发布的所有公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数
 * @param {Array<string>} ids - 用户ID数组
 * @returns {Promise<Array>} 用户发布的所有公告列表
 */
exports.getUserAnnouncements = async (req, res, next) => {
    const ids = Array.isArray(req.query.ids) ? req.query.ids : [];
    if (ids.length === 0) {
        return next(new AppError('请提供用户id', 400, 'MISSING_USER_ID'));
    }
    try {
        const result = await announcementService.getUserAnnouncements(ids);
        if (!result || result.length === 0 || (typeof result === 'object' && Object.keys(result).length === 0)) {
            return res.success(result, 404, '没有查询到相关公告', 'ANNOUNCEMENT_NOT_FOUND');
        }
        return res.success(result, 200, '查询成功', 'SUCCESS');
    } catch (err) {
        next(err); // 交给错误处理中间件
    }
};


/**
 * @description 获取当前用户发布的所有公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.user - 用户信息
 * @returns {Promise<Array>} 用户发布的所有公告列表
 */
exports.getCurrentUserAnnouncements = async (req, res, next) => {
    try {
        const result = await announcementService.getCurrentUserAnnouncements(req.user);
        if (!result || result.length === 0) {
            return res.success(result, 200, '没有查询到相关公告', 'ANNOUNCEMENT_NOT_FOUND');
        }
        return res.success(result, 200, '查询成功', 'SUCCESS');
    } catch (err) {
        next(err); // 交给错误处理中间件
    }
};


/**
 * @description 新增公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.user - 用户信息
 * @param {Object} req.body - 公告数据
 * @param {string} req.body.title - 公告标题 (必填)
 * @param {string} [req.body.coverUrl] - 公告封面URL (可选)
 * @param {string} [req.body.department] - 发布部门 (必填)
 * @param {string} [req.body.textUrl] - 公告Markdown文本URL (必填)
 * @returns {Promise<Object>} 新增的公告信息
 */
exports.createAnnouncement = async (req, res, next) => {
    try {
        const announcementData = req.body;
        const userInfo = req.user;
        const result = await announcementService.createAnnouncement(announcementData, userInfo);
        return res.success(result, 201, '公告新增成功', 'ANNOUNCEMENT_CREATED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};


/**
 * @description 修改公告接口
 * @param {Object} req - 请求对象
 * @param {number} req.user.groups - 用户组别，用于校验修改权限
 * @param {number} req.params.id - 公告ID
 * @param {Object} req.body - 更新数据
 * @param {string} [req.body.title] - 公告标题（可选）
 * @param {string} [req.body.coverUrl] - 公告封面URL（可选）
 * @param {string} [req.body.author] - 公告作者（可选）
 * @param {string} [req.body.department] - 发布部门（可选）
 * @param {string} [req.body.textUrl] - 公告Markdown文本URL（可选）
 * @returns {Promise<Object>} 更新后的公告信息
 */
exports.updateAnnouncement = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        const updateData = req.body;
        const displayName = req.user.displayName;
        const userGroups = req.user.groups;
        const result = await announcementService.updateAnnouncement(announcementId, updateData, displayName, userGroups);
        return res.success(result, 200, '公告更新成功', 'ANNOUNCEMENT_UPDATED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};


/**
 * @description 删除公告接口
 * @param {Object} req - 请求对象  
 * @param {Object} req.user.groups - 用户组别，用于校验修改权限
 * @param {number} req.params.id - 公告ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        const author = req.user.displayName;
        const userGroups = req.user.groups;
        const result = await announcementService.deleteAnnouncement(announcementId, author, userGroups);
        return res.success(result, 200, '公告删除成功', 'ANNOUNCEMENT_DELETED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};