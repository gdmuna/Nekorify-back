const { noTrueLogging } = require('sequelize/lib/utils/deprecations');
const { Announcement } = require('../models');
const AppError = require('../utils/AppError');
const { isValidUrl } = require('../utils/validUrlUtils');

/**    
 * @description 公告服务
 * @module services/announcementService
 */

/**
 * @description 获取公告列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 公告列表及分页信息
 */
exports.getAnnouncements = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 设置文章查询条件
    const condition = {
        order: [['createdAt', 'DESC']],
        offset,
        limit: pageSize,
    };

    // 查询公告并统计数据
    const { count, rows } = await Announcement.findAndCountAll(condition);

    // 统计分页信息
    const totalPages = Math.ceil(count / pageSize);
    const announcements = rows;

    return {
        pagination: {
            currentPage,             // 当前页
            pageSize,                // 每页记录数
            totalRecords: count,     // 总记录数
            totalPages,              // 总页数   
        },
        announcements
    };
};


/**
 * @description 获取公告详情接口
 * @param {Object} req - 请求对象
 * @param {Object} req.params - 请求参数
 * @param {number} req.params.id - 公告ID
 * @returns {Promise<Object>} 公告详情信息
 */
exports.getAnnouncementDetail = async (announcementId) => {
    // 查询公告
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
        throw new AppError('公告不存在', 404, 'ANNOUNCEMENT_NOT_FOUND');
    }
    // 浏览量加一
    announcement.views += 1 ;
    await announcement.save();
    return announcement;
};



/**
 * @description 新增公告接口（暂未实现权限校验）
 * @param {Object} req - 请求对象
 * @param {Object} req.user.position - 用户职位，用于校验修改权限       //暂未实现
 * @param {Object} req.body - 公告数据
 * @param {string} req.body.title - 公告标题 (必填)
 * @param {string} [req.body.cover_url] - 公告封面URL (可选)
 * @param {string} [req.body.author] - 公告作者 (必填)
 * @param {string} [req.body.department] - 发布部门 (必填)
 * @param {string} [req.body.text_md_url] - 公告Markdown文本URL (必填)
 * @returns {Promise<Object>} 新增的公告信息
 */
exports.createAnnouncement = async (announcementData) => {
    // 校验必填字段
    if (!announcementData.title) {
        throw new AppError('缺少公告标题', 400, 'MISSING_TITLE');
    }
    if (!announcementData.author) {
        throw new AppError('缺少公告作者', 400, 'MISSING_AUTHOR');
    }
    if (!announcementData.department) {
        throw new AppError('缺少发布部门', 400, 'MISSING_DEPARTMENT');
    }
    if (!announcementData.text_md_url) {
        throw new AppError('缺少公告Markdown文本URL', 400, 'MISSINGD_URL');
    }
    if (!isValidUrl(announcementData.text_md_url)) {
        throw new AppError('公告Markdown文本URL无效', 400, 'INVALID_TEXT_MD_URL');
    }
    // 校验可选字段
    if (announcementData.cover_url && !isValidUrl(announcementData.cover_url)) {
        throw new AppError('公告封面URL无效', 400, 'INVALID_COVER_URL');
    }
    // 检验同一作者是否发布过相同标题的公告
    const existingAnnouncement = await Announcement.findOne({
        where: {
            title: announcementData.title,
            author: announcementData.author,
        }
    });
    if (existingAnnouncement) {
        throw new AppError('同一作者已发布过相同标题的公告', 400, 'DUPLICATE_ANNOUNCEMENT');
    }

    // 创建公告
    const announcement = await Announcement.create(announcementData);
    if (!announcement) {
        throw new AppError('新增公告失败', 500, 'ANNOUNCEMENT_CREATION_FAILED');
    }
    return announcement;
};


/**
 * @description 删除公告接口（暂未实现权限校验）
 * @param {Object} req - 请求对象  
 * @param {Object} req.user.position - 用户职位，用于校验修改权限       //暂未实现
 * @param {number} req.params.id - 公告ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteAnnouncement = async (announcementId, stuId) => {
    // 校验ID
    if (!announcementId || isNaN(Number(announcementId))) {
        throw new AppError('公告ID无效', 400, 'INVALID_ANNOUNCEMENT_ID');
    }

    // 查找公告
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
        throw new AppError('公告不存在', 404, 'ANNOUNCEMENT_NOT_FOUND');
    }

    // 软删除公告
    await announcement.destroy();
    
    return announcement; // 返回被删除的公告信息
};


/**
 * @description 修改公告接口（暂未实现权限校验）
 * @param {Object} req - 请求对象
 * @param {number} req.user.position - 用户职位，用于校验修改权限       //暂未实现
 * @param {number} req.params.id - 公告ID
 * @param {Object} req.body - 更新数据
 * @param {string} [req.body.title] - 公告标题（可选）
 * @param {string} [req.body.cover_url] - 公告封面URL（可选）
 * @param {string} [req.body.author] - 公告作者（可选）
 * @param {string} [req.body.department] - 发布部门（可选）
 * @param {string} [req.body.text_md_url] - 公告Markdown文本URL（可选）
 * @returns {Promise<Object>} 更新后的公告信息
 */
exports.updateAnnouncement = async (announcementId, updateData) => {
    // 检验公告ID是否有效
    if (!announcementId || isNaN(Number(announcementId))) {
        throw new AppError('公告ID无效', 400, 'INVALID_ANNOUNCEMENT_ID');
    }
    // 检验传入的更新数据是否有效
    if (!updateData || typeof updateData !== 'object') {
        throw new AppError('更新数据无效', 400, 'INVALID_UPDATE_DATA');
    }
    // 检验公告是否存在
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
        throw new AppError('公告不存在', 404, 'ANNOUNCEMENT_NOT_FOUND');
    }
    // 更新公告
    if (updateData.title !== undefined) announcement.title = updateData.title;
    if (updateData.cover_url !== undefined) announcement.cover_url = updateData.cover_url;
    if (updateData.author !== undefined) announcement.author = updateData.author;
    if (updateData.department !== undefined) announcement.department = updateData.department;
    if (updateData.text_md_url !== undefined) announcement.text_md_url = updateData.text_md_url;

    await announcement.save();

    return announcement;
};