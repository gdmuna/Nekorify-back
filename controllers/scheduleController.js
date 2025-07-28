const scheduleService = require('../services/scheduleService');
/**
 * @description 日程控制器
 * @module controllers/scheduleController
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