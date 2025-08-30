const messageService = require('../services/messageService');
const AppError = require('../utils/AppError');

/**
 * @description 消息控制器
 * @module controllers/messageController
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
exports.getMessages = async (req, res, next) => {
    try {
        const userInfo = req.user; // 获取当前用户信息
        const result = await messageService.getMessagesList(userInfo, req.query);
        if (!result.messages || result.messages.length === 0) {
            return res.success(result, 404,'没有查询到相关消息', 'NO_MESSAGE');
        }
        return res.success(result, 200 ,'查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

exports.getMessageDetail = async (req, res, next) => {
    try {
        const messageId = req.params.id;
        const userInfo = req.user; // 获取当前用户信息
        const result = await messageService.getMessageDetail(messageId, userInfo);
        return res.success(result, 200 ,'消息详情查询成功', 'MESSAGE_DETAIL_SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

exports.addMessage = async (req, res, next) => {
    try {
        // 权限校验
        if (!req.user.groups.some(g => g === 'gdmu/ACM-presidency' || g === 'gdmu/NA-presidency')) {
            throw new AppError('您没有权限发送消息', 403, 'NO_PERMISSION');
        }
        const messageData = req.body;
        const userInfo = req.user; // 获取当前用户信息
        const result = await messageService.addMessage(messageData, userInfo);
        return res.success(result, 201,'消息添加成功', 'MESSAGE_ADDED');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
}

