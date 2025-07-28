const replayService = require('../services/replayService');
/**
 * @description 课程回放控制器
 * @module controllers/replayController
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