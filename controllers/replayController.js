const replayService = require('../services/replayService');
const AppError = require('../utils/AppError');

/**
 * @description 课程回放控制器
 * @module controllers/replayController
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

exports.getReplays = async (req, res, next) => {
    try {
        const result = await replayService.getReplays(req.query);
        if (!result.replays || result.replays.length === 0) {
            return res.success(result, 200 ,'没有查询到相关回放', 'NO_REPLAY');
        }
        return res.success(result, 200 ,'查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

exports.getReplayDetail = async (req, res, next) => {
    try {
        const replayId = req.params.id;
        const result = await replayService.getReplayDetail(replayId);
        if (!result) {
            return res.success(result, 200 ,'回放不存在', 'REPLAY_NOT_FOUND');
        }
        return res.success(result, 200, '回放详情查询成功', 'REPLAY_DETAIL_SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
}

exports.addReplay = async (req, res, next) => {
    try {
        // 权限校验
        if (!req.user.groups.some(g => g === 'gdmu/ACM-presidency' || g === 'gdmu/NA-presidency')) {
            throw new AppError('您没有权限新增回放', 403, 'NO_PERMISSION');
        }
        const replayData = req.body;
        const result = await replayService.addReplay(replayData);
        return res.success(result, 201 ,'回放添加成功', 'REPLAY_ADDED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

exports.updateReplay = async (req, res, next) => {
    try {
        // 权限校验
        if (!req.user.groups.some(g => g === 'gdmu/ACM-presidency' || g === 'gdmu/NA-presidency')) {
            throw new AppError('您没有权限更新回放', 403, 'NO_PERMISSION');
        }
        const replayId = req.params.id;
        const replayData = req.body;
        const result = await replayService.updateReplay(replayId, replayData);
        if (!result) {
            return res.success(result, 201 ,'回放不存在或更新失败', 'REPLAY_NOT_FOUND');
        }
        return res.success(result, 201 ,'回放更新成功', 'REPLAY_UPDATED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

exports.deleteReplay = async (req, res, next) => {
    try {
        // 权限校验
        if (!req.user.groups.some(g => g === 'gdmu/ACM-presidency' || g === 'gdmu/NA-presidency')) {
            throw new AppError('您没有权限删除回放', 403, 'NO_PERMISSION');
        }
        const replayId = req.params.id;
        const result = await replayService.deleteReplay(replayId);
        if (!result) {
            return res.success(result, 204 ,'回放不存在或删除失败', 'REPLAY_NOT_FOUND');
        }
        return res.success(result, 204 ,'回放删除成功', 'REPLAY_DELETED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};