const taskService = require('../services/taskService');

/**
 * @description 任务控制器
 * @module controllers/taskController
 */

/**
 * @description 获取本用户的任务列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 任务列表及分页信息
 */
exports.getTasks = async (req, res, next) => {
    try {
        if(!req.user.name) {
            throw new AppError('未登录 无法获取非本人任务', 401, 'NOT_LOGGED_IN');
        }
        const result = await taskService.getTasks({ ...req.query, stuId: req.user.name });
        if (!result.tasks || result.tasks.length === 0) {
            return res.success(result, '没有查询到相关任务', 'NO_TASK');
        }
        return res.success(result, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};


/**
 * @description 修改任务接口
 * @param {Object} req - 请求对象
 * @param {Object} req.params - 路由参数
 * @param {Object} req.params.id - 任务ID
 * @param {Object} req.body - 请求体
 * @param {string} [req.body.title] - 任务标题（可选）
 * @param {string} [req.body.text] - 任务内容（可选）
 * @param {string} [req.body.executor_id] - 任务执行人（可选）
 * @param {string} [req.body.executor_name] - 执行人姓名（可选）
 * @param {string} [req.body.start_time] - 任务开始时间（可选）
 * @param {string} [req.body.ddl] - 任务截止时间（可选）
 * @returns {Promise<Object>} 修改结果
 */
exports.updateTask = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const stuId = req.user.name; 
        const title = req.body.title;
        const text = req.body.text;
        const  start_time = req.body.start_time
        const ddl = req.body.ddl;
        const result = await taskService.updateTask(taskId, stuId, title, text, start_time, ddl);
        return res.success(result, '任务修改成功', 'TASK_UPDATED');
    } catch (error) {
        next(error);
    }
};