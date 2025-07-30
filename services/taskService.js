const { Task, User, TasksUsers } = require('../models');
const AppError = require('../utils/AppError');

/**
 * @description 任务服务
 * @module services/taskService
 */

/**
 * @description 获取本用户的任务列表接口
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
 * @description 修改任务接口
 * @param {Object} req - 请求对象
 * @param {Object} req.params - 路由参数
 * @param {Object} req.params.id - 任务ID
 * @param {Object} req.body - 请求体
 * @param {string} [req.body.title] - 任务标题（可选）
 * @param {string} [req.body.text] - 任务内容（可选）
 * @param {string} [req.body.start_time] - 任务开始时间（可选）
 * @param {string} [req.body.ddl] - 任务截止时间（可选）
 * @returns {Promise<Object>} 修改结果
 */
exports.updateTask = async (taskId, stuId, title, text, start_time, ddl) => {
    // 校验任务ID是否为数字
    if (!taskId || isNaN(Number(taskId))) {
        throw new AppError('任务ID无效', 400, 'INVALID_TASK_ID');
    }
    // 校验更新字段是否为空
    if (!title && !text && !start_time && !ddl) {
        throw new AppError('至少需要提供一个更新字段', 400, 'MISSING_UPDATE_FIELDS');
    }
    // 校验任务是否存在
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new AppError('任务不存在', 404, 'TASK_NOT_FOUND');
    }
    // 通过user表的stu_id对应的id来查找task表内的executor_id
    const userInfo = await User.findByPk(stuId);
    if (userInfo.stu_id !== stuId) {
        throw new AppError('该学生暂无任务', 403, 'STU_NOT_TASK');
    }
    // 校验学生是否为任务执行人
    if (task.executor_id !== userInfo.id) {
        throw new AppError('该学生不是任务执行人', 403, 'STU_NOT_EXECUTOR');
    }

    if (!updateUrl) {
        throw new AppError('缺少 text_md_url', 400, 'MISSING_TEXT_MD_URL');
    }

    article.text_md_url = updateUrl;
    await article.save();

    return article;
};