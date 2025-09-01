const { Replay, User} = require('../models');

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


/**
 * @description 获取当前用户发布的所有回放接口
 * @param {Object} req - 请求对象
 * @param {Object} req.user - 用户信息
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Array>} 用户发布的所有回放列表
 */
exports.getCurrentUserReplays = async (user, query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    if (!user || !user.name) {
        throw new AppError("用户不存在", 404, "USER_NOT_FOUND");
    }
    // 先查用户表，获取用户主键 id
    const dbUser = await User.findOne({ where: { stu_id: user.name } });
    if (!dbUser) {
        throw new AppError("用户不存在", 404, "USER_NOT_FOUND");
    }
    // 用用户 id 查公告表，分页查询
    const { count, rows } = await Replay.findAndCountAll({
        where: {
            author_id: dbUser.id,
        },
        order: [["createdAt", "DESC"]],
        offset,
        limit: pageSize,
    });
    const totalPages = Math.ceil(count / pageSize);

    return {
        pagination: {
            currentPage,
            pageSize,
            totalRecords: count,
            totalPages,
        },
        replays: rows,
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
exports.addReplay = async (replayData,userInfo) => {
    if (!replayData.title || !replayData.videoUrl || !replayData.coverUrl || !replayData.department) {
        throw new Error('缺少必要的回放数据');
    }
    const userId = await User.findOne({ where: { stu_id: userInfo.name } });
    if (!userInfo) {
        throw new AppError('学生ID不存在', 404, 'STUID_NOT_FOUND');
    }
    // 创建新的课程回放记录
    const replay = await Replay.create({
        author_id: userId.id,
        author: userInfo.displayName,
        title: replayData.title,
        video_url: replayData.videoUrl,
        cover_url: replayData.coverUrl,
        department: replayData.department
    });
    return replay;
};


/**
 * @description 更新课程回放
 * @param {number} replayId - 回放ID
 * @param {Object} replayData - 更新数据
 * @returns {Promise<Object>} 更新后的回放记录
 */
exports.updateReplay = async (replayId, replayData) => {
    // 查找课程回放记录
    const replay = await Replay.findByPk(replayId);
    if (!replay) {
        return null; // 回放不存在
    }
    
    // 检查必要字段
    if (!replayData || Object.keys(replayData).length === 0) {
        throw new Error('缺少必要的回放数据');
    }

    // 更新课程回放记录
    if (replayData.title !== undefined) {
        replay.title = replayData.title;
    }
    if (replayData.videoUrl !== undefined) {
        replay.video_url = replayData.videoUrl;
    }
    if (replayData.coverUrl !== undefined) {
        replay.cover_url = replayData.coverUrl;
    }
    if (replayData.department !== undefined) {
        replay.department = replayData.department;
    }
    await replay.save();
    return replay;
};

/**
 * @description 删除课程回放
 * @param {number} replayId - 回放ID
 * @returns {Promise<boolean>} 是否删除成功
 */
exports.deleteReplay = async (replayIds) => {
    // 兼容单个ID和ID数组
    const idArray = Array.isArray(replayIds) ? replayIds : [replayIds];
    
    if (idArray.length === 0) {
        throw new AppError('回放ID无效', 400, 'INVALID_REPLAY_ID');
    }
    
    // 查找所有回放记录
    const replays = await Replay.findAll({
        where: { id: idArray }
    });
    
    if (replays.length === 0) {
        throw new AppError('未找到任何回放', 404, 'REPLAY_NOT_FOUND');
    }
    
    // 批量删除回放
    await Promise.all(replays.map(replay => replay.destroy()));
    
    return {
        deletedCount: replays.length,
        deletedIds: replays.map(r => r.id),
    };
};