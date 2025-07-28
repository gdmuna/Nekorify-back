const replayService = require('../services/replayService');

/**
 * @description 课程回放控制器
 * @module controllers/replayController
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

exports.getReplays = async (req, res, next) => {
    try {
        const result = await replayService.getReplays(req.query);
        if (!result.replays || result.replays.length === 0) {
            return res.success(result, '没有查询到相关回放', 'NO_REPLAY');
        }
        return res.success(result, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};