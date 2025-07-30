const { User_message_status, Message, User,sequelize } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

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

exports.addMessage = async (messageData, userInfo) => {
    if (!messageData.text) {
        throw new AppError('缺少属性', 400, 'MISSING_TEXT');
    }
    if (!Array.isArray(messageData.receiverIds) || messageData.receiverIds.length === 0) {
        throw new AppError('缺少接收者', 400, 'MISSING_RECEIVER');
    }

    

    // 使用事务，如果后续操作未完成或错误，则回滚事务确保数据一致性
    const transaction = await sequelize.transaction();
    try {
        const sender = await User.findOne({
            where: { stu_id: userInfo.name },
            attributes: ['id'],
            transaction
        });
        if (!sender) {
            throw new AppError('发送者不存在', 404, 'SENDER_NOT_FOUND');
        }
        messageData.sender_id = sender.id;

        // 创建消息
        const message = await Message.create(messageData, { transaction });

        // 查找接收者
        const users = await User.findAll({
            where: { stu_id: { [Op.in]: messageData.receiverIds } },
            transaction
        });
        if (users.length === 0) {
            throw new AppError('接收者不存在', 404, 'RECEIVER_NOT_FOUND');
        }

        // 创建消息状态
        const userStatuses = users.map(user => ({
            receiver_id: user.id,
            message_id: message.id,
            is_read: false
        }));

        await User_message_status.bulkCreate(userStatuses, { transaction });

        await transaction.commit();
        return message;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

exports.getMessagesByUserInfo = async (userInfo, query = {}) => {
    // 1. 获取用户id
    const user = await User.findOne({ where: { stu_id: userInfo.name } });
    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }

    // 2. 查询用户的所有消息状态，拿到 message_id
    const userMessageStatuses = await User_message_status.findAll({
        where: { receiver_id: user.id }, // 或 user_id，字段名按你的表结构调整
        attributes: ['message_id']
    });

    const messageIds = userMessageStatuses.map(item => item.message_id);

    if (messageIds.length === 0) {
        return {
            pagination: {
                currentPage: 1,
                pageSize: query.pageSize ? Number(query.pageSize) : 10,
                totalRecords: 0,
                totalPages: 0,
            },
            messages: []
        };
    }

    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const { count, rows } = await Message.findAndCountAll({
        where: { id: { [Op.in]: messageIds } },
        order: [['createdAt', 'DESC']],
        offset,
        limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);

    return {
        pagination: {
            currentPage,
            pageSize,
            totalRecords: count,
            totalPages,
        },
        messages: rows
    };
};

