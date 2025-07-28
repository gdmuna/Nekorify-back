const { Schedule } = require('../models');
/**
 * @description 日程服务
 * @module services/scheduleService
 */

// 获取日程列表接口
exports.getSchedules = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 设置日程查询条件
    const condition = {
        order: [['createdAt', 'DESC']],
        offset,
        limit: pageSize,
    };
    
    // 查询日程并统计数据
    const { count, rows } = await Schedule.findAndCountAll(condition);

    // 统计分页信息
    const totalPages = Math.ceil(count / pageSize);
    const schedules = rows;

    return {
        pagination: {
            currentPage,             // 当前页
            pageSize,                // 每页记录数
            totalRecords: count,     // 总记录数
            totalPages,              // 总页数   
        },
        schedules
    };
};