const { Task, User, TasksUsers } = require('../models');
const AppError = require('../utils/AppError');
const { sequelize } = require('../models');

/**
 * @description 任务服务
 * @module services/taskService
 */

/**
 * @description 查询本用户的任务列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 任务列表及分页信息
 */
exports.getTasks = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 只允许查自己的任务
    const stuId = query.stuId;
    const userInfo = await User.findOne({ where: { stu_id: stuId } });
    if (!userInfo) {
        throw new AppError('学生用户不存在', 404, 'STUID_NOT_FOUND');
    }

    // 查找该用户参与的所有任务id
    // 先查TasksUsers关联表
    const tasksUsers = await TasksUsers.findAll({ where: { executor_id: userInfo.id } });
    // 查Task表，取出每个元素的 task_id 字段放到数组中
    const taskIds = tasksUsers.map(tu => tu.task_id);

    // 设置任务查询条件
    const condition = {
        where: { id: taskIds },
        order: [['createdAt', 'DESC']],
        offset,
        limit: pageSize,
    };

    // 查询任务并统计数据
    const { count, rows } = await Task.findAndCountAll(condition);

    // 统计分页信息
    const totalPages = Math.ceil(count / pageSize);
    const tasks = rows;

    return {
        pagination: {
            currentPage,             // 当前页
            pageSize,                // 每页记录数
            totalRecords: count,     // 总记录数
            totalPages,              // 总页数   
        },
        tasks
    };
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
exports.createTask = async (params) => {
    const transaction = await sequelize.transaction();// 开启事务
    // 参数校验
    if (!params.exectorIds || !params.title || !params.text || !params.publish_department || !params.start_time || !params.ddl) {
        throw new AppError('任务标题、内容、发布部门、开始时间、截止时间和执行者id都是必填项', 400, 'MISSING_REQUIRED_FIELDS');
    }
    try {
        // 创建任务
        const { exectorIds, ...taskFields } = params;
        const task = await Task.create(taskFields, { transaction: transaction });
        // 创建任务-用户关联
        if (Array.isArray(exectorIds) && exectorIds.length > 0) {
            const taskUserRecords = exectorIds.map(executorId => ({
                task_id: task.id,
                executor_id: executorId
            }));
            await TasksUsers.bulkCreate(taskUserRecords, { transaction: transaction });
        }
        await transaction.commit(); // 提交事务
        return {
            task,
        };
    } catch (error) {
        await transaction.rollback(); // 回滚事务
        throw error;
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
exports.deleteTask = async (params) => {
    const taskId = params.id;
    // ID校验
    if (!taskId || isNaN(Number(taskId))) {
        throw new AppError('任务ID无效', 400, 'INVALID_TASK_ID');
    }
    const transaction = await sequelize.transaction(); // 开启事务
    try {
        // 查找任务
        const task = await Task.findByPk(taskId);
        if (!task) {
            throw new AppError('任务不存在', 404, 'TASK_NOT_FOUND');
        }
        // 删除任务
        await Task.destroy({ where: { id: taskId } }, { transaction: transaction });
        // 删除关联记录
        await TasksUsers.destroy({ where: { task_id: taskId } }, { transaction: transaction });
        await transaction.commit(); // 提交事务
        return {
            taskId,
        };
    } catch (error) {
        await transaction.rollback(); // 回滚事务
        throw error;
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
exports.updateTask = async (params) => {
    // 获取参数
    const { taskId, ...taskFields } = params;
    // ID校验
    console.log("任务id是", taskId);
    if (!taskId || isNaN(Number(taskId))) {
        throw new AppError('任务ID无效', 400, 'INVALID_TASK_ID');
    }
    // 查找任务
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new AppError('任务不存在', 404, 'TASK_NOT_FOUND');
    }
    // 检查是否有需要更新的字段
    if (Object.keys(taskFields).length === 0) {
        throw new AppError('至少需要提供一个更新字段', 400, 'MISSING_UPDATE_FIELDS');
    }
    // 更新任务主表（tasks表）
    await Task.update(taskFields, { where: { id: taskId } });
    // 查询最新任务
    const updatedTask = await Task.findByPk(taskId);
    return {
        updatedTask,
    };
};