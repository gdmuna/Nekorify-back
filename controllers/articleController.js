const articleService = require("../services/articleService");
const AppError = require("../utils/AppError");
const userService = require("../services/userService"); // 需有用户服务
const groupMeta = require("../config/groupMeta");

/**
 * @description 文章控制器
 * @module controllers/articleController
 */

// 获取文章列表接口
exports.getAllArticles = async (req, res, next) => {
    try {
        const result = await articleService.getArticles(req.query);
        if (!result.articles || result.articles.length === 0) {
            return res.success(result, "没有查询到相关文章", "ARTICLE_NOT_FOUND");
        }
        return res.success(result, 200, "查询成功", "SUCCESS");
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

// 获取文章详情接口
exports.getArticleDetail = async (req, res, next) => {
    try {
        const articleId = req.params.id; // 获取文章ID
        const result = await articleService.getArticleDetail(articleId);
        if (!result) {
            return res.success(result, "文章不存在", "ARTICLE_NOT_FOUND");
        }
        return res.success(result, 200, "查询成功", "SUCCESS");
    } catch (error) {
        next(error); // 交给错误处理中间件
    }
};

// 新增文章接口
exports.addArticle = async (req, res, next) => {
    try {
        // 权限校验
        const hasPermission = req.user.groups.some((g) => {
            const meta = groupMeta[g];
            return meta && meta.level <= 2;
        });
        if (!hasPermission) {
            throw new AppError("您没有权限添加文章", 403, "NO_PERMISSION");
        }
        //
        const { title, textUrl, coverUrl } = req.body;
        const userInfo = req.user;
        const result = await articleService.addArticle(
            title,
            textUrl,
            userInfo,
            coverUrl
        );
        return res.success(result, 201, "文章添加成功", "ARTICLE_ADDED");
    } catch (error) {
        next(error);
    }
};

// 修改文章接口
exports.updateArticle = async (req, res, next) => {
    try {
        // 权限校验
        const userGroups = req.user.groups || [];
        const userLevel = Math.min(...userGroups.map(g => (groupMeta[g]?.level ?? 99)));
        const isSuperAdmin = userLevel === 0;

        const articleId = req.params.id;
        const body = req.body;

        // 查询当前用户数据库ID
        const userInfo = await userService.getUserByStuId(req.user.name);

        const userId = userInfo.id;

        // 查询文章详情，获取作者ID
        const article = await articleService.getArticleDetail(articleId);
        if (!article) {
            throw new AppError('文章不存在', 404, 'ARTICLE_NOT_FOUND');
        }

        // 权限判断
        const canEdit = isSuperAdmin ||
            (userLevel <= 2 && article.authorId === userId);

        if (!canEdit) {
            throw new AppError('您没有权限修改该文章', 403, 'NO_PERMISSION');
        }

        const department = userGroups[1];
        const result = await articleService.updateArticle(articleId, userId, department, body);
        return res.success(result, 201, '文章修改成功', 'ARTICLE_UPDATED');
    } catch (error) {
        next(error);
    }
};


// 删除文章接口(软删除)
exports.deleteArticle = async (req, res, next) => {
    try {
        const articleId = req.params.id;
        const stuId = req.user.name;
        const result = await articleService.deleteArticle(articleId, stuId);
        return res.success(result, 204, "文章删除成功", "ARTICLE_DELETED");
    } catch (error) {
        next(error);
    }
};
