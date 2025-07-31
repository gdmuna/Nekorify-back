const taskService = require('../services/taskService');
const AppError = require('../utils/AppError');

/**
 * @description 任务控制器
 * @module controllers/taskController
 */

/**
 * @description 查询本用户的任务列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 任务列表及分页信息
 */
exports.getTasks = async (req, res, next) => {
    try {
        if (!req.user.name) {
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
 * @description 修改任务接口（暂未实现权限校验）
 * @param {Object} req - 请求对象
 * @param {Object} req.params - 路由参数
 * @param {Object} req.params.id - 任务ID
 * @param {Object} req.user.position - 用户职位，用于校验修改权限       //暂未实现
 * @param {Object} req.body - 请求体
 * @param {string} [req.body.title] - 任务标题（可选）
 * @param {string} [req.body.text] - 任务内容（可选）
 * @param {string} [req.body.publish_department] - 任务发布部门（可选）
 * @param {string} [req.body.start_time] - 任务开始时间（可选）
 * @param {string} [req.body.ddl] - 任务截止时间（可选）
 * @returns {Promise<Object>} 修改结果
 */
exports.updateTask = async (req, res, next) => {
    try {
        // // 权限校验
        // if (req.user.position !== 'admin') {
        //     throw new AppError('您没有权限修改该任务', 403, 'NO_PERMISSION');
        // }
        const params = { taskId: req.params.id, ...req.body };
        const result = await taskService.updateTask(params);
        return res.success(result, '任务修改成功', 'TASK_UPDATED');
    } catch (error) {
        next(error);
    }
};


/**
 * @description 新增任务接口（暂未实现权限校验）
 * @param {Object} req - 请求对象
 * @param {Object} req.user.position - 用户职位，用于校验修改权限       //暂未实现
 * @param {Object} req.body - 请求体
 * @param {Array<number>} req.body.exectorIds - 学生ID数组，支持多个人（必填）
 * @param {string} req.body.title - 任务标题（必填）
 * @param {string} req.body.text - 任务内容（必填）
 * @param {string} req.body.publish_department - 任务发布部门（必填）
 * @param {string} req.body.start_time - 任务开始时间（必填）
 * @param {string} req.body.ddl - 任务截止时间（必填）
 * @returns {Promise<Object>} 新增任务结果
 */
exports.createTask = async (req, res, next) => {
    try {
        // // 权限校验
        // if (req.user.position !== 'admin') {
        //     throw new AppError('您没有权限修改该任务', 403, 'NO_PERMISSION');
        // }
        const result = await taskService.createTask(req.body);
        return res.success(result, '任务新增成功', 'TASK_CREATED');
    } catch (error) {
        next(error);
    }
};


/**
 * @description 删除任务接口（暂未实现权限校验）
 * @param {Object} req - 请求对象
 * @param {Object} req.params - 路由参数
 * @param {Object} req.params.id - 任务ID
 * @param {Object} req.user.position - 用户职位，用于校验修改权限       //暂未实现
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteTask = async (req, res, next) => {
    try {
        // // 权限校验
        // if (req.user.position !== 'admin') {
        //     throw new AppError('您没有权限删除该任务', 403, 'NO_PERMISSION');
        // }
        const result = await taskService.deleteTask(req.params);
        return res.success(result, '任务删除成功', 'TASK_DELETED');
    } catch (error) {
        next(error);
    }
};
