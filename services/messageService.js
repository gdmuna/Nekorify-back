const { User_message_status, Message, User } = require('../models');
const AppError = require('../utils/AppError');

/**
 * @description 消息服务
 * @module services/messageService
 */

/**
 * @description 获取消息列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {string} [req.query.stuId] - 学生ID（可选）
 * @param {boolean} [req.query.is_read] - 是否已读（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 消息列表及分页信息
 */
exports.getMessages = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 校验stuId是否为数字
    if (query.stuId && isNaN(Number(query.stuId))) {
        throw new AppError('学生ID输入错误', 400, 'INVALID_STUID');
    }

    // 获取用户ID
    let userId;
    if (query.stuId) {
        const userInfo = await User.findOne({ where: { stu_id: query.stuId } });
        if (!userInfo) {
            throw new AppError('获取用户失败 用户ID不存在', 404, 'USERID_NOT_FOUND');
        }
        userId = userInfo.id;
    }

    // 设置查询条件
    const where = {}; // Message表的查询条件（可为空）

    // 与user_message_status表关联查询，设置 user_message_status 的查询条件
    const statusWhere = {};
    if (userId) {
        statusWhere.user_id = userId;
    }
    if (query.is_read !== undefined) {
        statusWhere.is_read = query.is_read === 'true'; // 转换为布尔值
    }
    const include = [{
        model: User_message_status,
        where: statusWhere,
        required: true // 关联查询
    }];

    // 设置消息查询条件
    const condition = {
        where,
        include,
        order: [['createdAt', 'DESC']],
        offset,
        limit: pageSize,
    };

    // 查询消息并统计数据
    const { count, rows } = await Message.findAndCountAll(condition);

    // 统计分页信息
    const totalPages = Math.ceil(count / pageSize);
    const messages = rows;

    return {
        pagination: {
            currentPage,
            pageSize,
            totalRecords: count,
            totalPages,
        },
        messages
    };
};