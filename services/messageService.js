const { User_message_status, Message } = require('../models');
const AppError = require('../utils/AppError');
/**
 * @description 消息服务
 * @module services/messageService
 */

// 获取消息列表接口
exports.getMessages = async (userId) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 校验userId是否为数字
    if (query.id && isNaN(Number(query.id))) {
        throw new AppError('消息ID输入错误', 400, 'INVALID_MESSAGE_ID');
    }

    // 设置消息查询条件
    const condition = {
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
            currentPage,             // 当前页
            pageSize,                // 每页记录数
            totalRecords: count,     // 总记录数
            totalPages,              // 总页数   
        },
        messages
    };
};