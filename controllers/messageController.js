const messageService = require('../services/messageService');
/**
 * @description 消息控制器
 * @module controllers/messageController
 */

// 获取消息列表接口
exports.getMessages = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const result = await messageService.getMessages(userId);
        if (!result.messages || result.messages.length === 0) {
            return res.success(result, '没有查询到相关消息', 'NO_MESSAGE');
        }
        return res.success(result, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};