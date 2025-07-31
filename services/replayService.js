const { Replay } = require('../models');

/**
 * @description 课程回放服务
 * @module services/replayService
 */

/**
 * @description 获取回放列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {string} [req.query.department] - 开课部门（可选）     // 尚未实现
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

exports.getReplayDetail = async (replayId) => {
    // 查找课程回放记录
    const replay = await Replay.findByPk(replayId);
    if (!replay) {
        return null; // 回放不存在
    }
    //观看数增加
    await replay.increment('views');
    return replay;
};

/**
 * @description 添加课程回放
 * @param {Object} replayData - 回放数据
 * @returns {Promise<Object>} 新创建的回放记录
 */

exports.addReplay = async (replayData) => {
    // 创建新的课程回放记录
    const replay = await Replay.create(replayData);
    return replay;
};

exports.updateReplay = async (replayId, replayData) => {
    // 查找课程回放记录
    const replay = await Replay.findByPk(replayId);
    if (!replay) {
        return null; // 回放不存在
    }
    
    // 更新课程回放记录
    await replay.update(replayData);
    return replay;
};

/**
 * @description 删除课程回放
 * @param {number} replayId - 回放ID
 * @returns {Promise<boolean>} 是否删除成功
 */
exports.deleteReplay = async (replayId) => {
    // 查找课程回放记录
    const replay = await Replay.findByPk(replayId);
    if (!replay) {
        return false; // 回放不存在
    }
    
    // 删除课程回放记录
    await replay.destroy();
    return true;
};