const { User_message_status, Message, User, sequelize } = require('../models');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

/**
 * @description 消息服务
 * @module services/messageService
 */

/**
 * 发送消息
 * @param {Object} messageData - 消息内容，包含 text、receiverIds 等
 * @param {Object} userInfo - 当前登录用户信息，包含 name（stu_id）
 * @returns {Object} 创建的消息对象
 * @throws {AppError} 缺少属性、接收者不存在、发送者不存在等
 */
exports.addMessage = async (messageData, userInfo) => {
    // 校验消息内容和接收者
    if (!messageData.text) {
        throw new AppError('缺少属性', 400, 'MISSING_TEXT');
    }
    if (!Array.isArray(messageData.receiverIds) || messageData.receiverIds.length === 0) {
        throw new AppError('缺少接收者', 400, 'MISSING_RECEIVER');
    }

    // 使用事务，保证数据一致性
    const transaction = await sequelize.transaction();
    try {
        // 查找发送者
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

        // 查找所有接收者
        const users = await User.findAll({
            where: { stu_id: { [Op.in]: messageData.receiverIds } },
            transaction
        });
        if (users.length === 0) {
            throw new AppError('接收者不存在', 404, 'RECEIVER_NOT_FOUND');
        }

        // 为每个接收者创建消息状态
        const userStatuses = users.map(user => ({
            receiver_id: user.id,
            message_id: message.id,
            is_read: false
        }));

        // 批量插入消息状态
        await User_message_status.bulkCreate(userStatuses, { transaction });

        // 提交事务
        await transaction.commit();
        return message;
    } catch (err) {
        // 回滚事务
        await transaction.rollback();
        throw err;
    }
};

/**
 * 根据用户信息获取消息（带分页）
 * @param {Object} userInfo - 当前登录用户信息，包含 name（stu_id）
 * @param {Object} query - 分页参数，包含 currentPage、pageSize
 * @returns {Object} 消息分页结果
 * @throws {AppError} 用户不存在
 */
exports.getMessagesList = async (userInfo, query = {}) => {
    // 1. 获取用户id
    const user = await User.findOne({ where: { stu_id: userInfo.name } });
    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }

    // 2. 查询用户的所有消息状态，拿到 message_id
    const userMessageStatuses = await User_message_status.findAll({
        where: { receiver_id: user.id },
        attributes: ['message_id']
    });

    const messageIds = userMessageStatuses.map(item => item.message_id);

    // 没有消息时返回空分页
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

    // 分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 查询消息内容并分页
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


exports.getMessageDetail = async (messageId, userInfo) => {
    // 1. 获取用户id
    const user = await User.findOne({ where: { stu_id: userInfo.name } });
    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }
    
    // 2. 查找消息状态
    const userMessageStatus = await User_message_status.findOne({
        where: { message_id: messageId, receiver_id: user.id } // 确保是当前用户的消息状态
    });
    

    if (!userMessageStatus) {
        throw new AppError('消息不存在或未接收', 404, 'MESSAGE_NOT_FOUND');
    }

    // 3. 更新消息状态为已读
    userMessageStatus.is_read = true;
    await userMessageStatus.save();

    // 4. 查找消息内容
    const message = await Message.findByPk(messageId);
    if (!message) {
        throw new AppError('消息内容不存在', 404, 'MESSAGE_CONTENT_NOT_FOUND');
    }

    return message;
}