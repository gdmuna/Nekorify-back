const { Announcement } = require('../models');
/**
 * @description 公告服务
 * @module services/announcementService
 */

// 获取公告列表接口
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