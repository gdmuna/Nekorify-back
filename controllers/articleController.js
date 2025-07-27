const { success, failure } = require('../utils/resopnses');

const articleService = require('../services/articleService');

exports.getAllArticles = async (req, res) => {
    try {
        const result = await articleService.getArticles(req.query);
        if (!result.articles || result.articles.length === 0) {
            return success(res, '没有查询到相关文章', [result]);
        }
        return success(res, '查询成功', result);
    } catch (err) {
        return failure(res, { message: err.message });
    }
};