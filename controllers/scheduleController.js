const scheduleService = require('../services/scheduleService');

/**
 * @description 日程控制器
 * @module controllers/scheduleController
 */

/**
 * @description 获取日程列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 日程列表及分页信息
 */
exports.getSchedules = async (req, res, next) => {
    try {
        const result = await scheduleService.getSchedules(req.query);
        if (!result.schedules || result.schedules.length === 0) {
            return res.success(result, '没有查询到相关日程', 'NO_SCHEDULE');
        }
        return res.success(result, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};