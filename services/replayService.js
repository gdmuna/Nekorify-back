const { Replay } = require('../models');

// 获取课程回放列表接口
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