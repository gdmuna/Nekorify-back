const articleService = require('../services/articleService');

exports.getAllArticles = async (req, res, next) => {
    try {
        const result = await articleService.getArticles(req.query);
        if (!result.articles || result.articles.length === 0) {
            return res.json({ message: '没有查询到相关文章', data: result });
        }
        return res.json({ message: '查询成功', data: result });
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};