const taskService = require('../services/taskService');


exports.getTasks = async (req, res, next) => {
    try {
        const result = await taskService.getTasks(req.query);
        if (!result.tasks || result.tasks.length === 0) {
            return res.json({ message: '没有查询到相关任务', data: result });
        }
        return res.json({ message: '查询成功', data: result });
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};