const taskService = require('../services/taskService');

/**
 * @description 任务控制器
 * @module controllers/taskController
 */

/**
 * @description 获取任务列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {string} [req.query.stuId] - 学生ID（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 任务列表及分页信息
 */
exports.getTasks = async (req, res, next) => {
    try {
        const result = await taskService.getTasks(req.query);
        if (!result.tasks || result.tasks.length === 0) {
            return res.sucess(result, '没有查询到相关任务', 'NO_TASK');
        }
        return res.success(result, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};