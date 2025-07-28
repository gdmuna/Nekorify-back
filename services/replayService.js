const { Replay } = require('../models');

/**
 * @description 课程回放服务
 * @module services/replayService
 */

/**
 * @description 获取回放列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {string} [req.query.courseId] - 课程ID（可选）       // 尚未实现
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 回放列表及分页信息
 */
exports.getReplays = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 设置课程回放查询条件
    const condition = {
        order: [['createdAt', 'DESC']],
        offset,
        limit: pageSize,
    };
    
    // 查询课程回放并统计数据
    const { count, rows } = await Replay.findAndCountAll(condition);

    // 统计分页信息
    const totalPages = Math.ceil(count / pageSize);
    const replays = rows;

    return {
        pagination: {
            currentPage,             // 当前页
            pageSize,                // 每页记录数
            totalRecords: count,     // 总记录数
            totalPages,              // 总页数   
        },
        replays
    };
};