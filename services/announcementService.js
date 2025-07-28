const { Announcement } = require('../models');

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
 * @description 更新公告接口
 * @param {number} id - 公告ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<Object>} 更新后的公告信息
 */
exports.updateAnnouncement = async (id, updateData) => {
    // 查找公告
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
        throw new Error('公告不存在');
    }

    // 更新公告
    const updatedAnnouncement = await announcement.update(updateData);
    return updatedAnnouncement;

};  