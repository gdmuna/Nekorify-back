const articleService = require('../services/articleService');

/**
 * @description 文章控制器
 * @module controllers/articleController
 */

// 获取文章列表接口
exports.getAllArticles = async (req, res, next) => {
    try {
        const result = await articleService.getArticles(req.query);
        if (!result.articles || result.articles.length === 0) {
            return res.success(result, '没有查询到相关文章', 'NO_ARTICLE');
        }
        return res.success(result, '查询成功', 'SUCCESS');
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

// 修改文章接口
exports.updateArticle = async (req, res, next) => {
    try {
        const articleId = req.params.id;
        const updateUrl = req.body.updateUrl; 
        const stuId = req.user.stu_id; 
        const result = await articleService.updateArticle(articleId, updateUrl, stuId);
        return res.success(result, '文章修改成功', 'ARTICLE_UPDATED');
    } catch (error) {
        next(error);
    }
};

// 删除文章接口(软删除)
exports.deleteArticle = async (req, res, next) => {
    try {
        const articleId = req.params.id;
        const stuId = req.user.stu_id; 
        await articleService.deleteArticle(articleId, stuId);
        return res.success(null, '文章删除成功', 'ARTICLE_DELETED');
    } catch (error) {
        next(error);
    }
};