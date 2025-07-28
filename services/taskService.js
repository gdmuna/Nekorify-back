const { Task, User } = require('../models');
const AppError = require('../utils/AppError');

/**
 * @description 任务服务
 * @module services/taskService
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
exports.getTasks = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 校验stuId是否为数字
    if (query.stuId && isNaN(Number(query.stuId))) {
        throw new AppError('学生ID输入错误', 400, 'INVALID_STUID');
    }

    // 设置查询条件
    const where = {};
    if (query.stuId) {
        const userInfo = await User.findOne({
            where: { stu_id: query.stuId }
        });
        if (!userInfo) {
            throw new AppError('获取任务失败 学生ID不存在', 404, 'STUID_NOT_FOUND');
        }
        where.executor_id = userInfo.id; // 使用userId进行查询
    }

    // 设置任务查询条件
    const condition = {
        where,
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