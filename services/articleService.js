const { Article, User } = require('../models');
const AppError = require('../utils/AppError');
const groupMeta = require('../config/groupMeta');

/**
 * @description 文章服务
 * @module services/articleService
 */

// 获取文章列表接口
exports.getArticles = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 校验stuId是否为数字
    if (query.stuId && isNaN(Number(query.stuId))) {
        throw new AppError('学生ID输入错误', 400, 'INVALID_STUID');
    }

    // 设置查询条件
    const where = {};
    if (query.stuId) {
        const userInfo = await User.findOne({
            where: { stu_id: query.stuId }
        });
        if (!userInfo) {
            throw new AppError('获取文章失败 学生ID不存在', 404, 'STUID_NOT_FOUND');
        }
        where.author_id = userInfo.id; // 使用userId进行查询
    }

    // 设置文章查询条件
    const condition = {
        where,
        order: [['createdAt', 'DESC']],
        offset,
        limit: pageSize,
    };

    // 查询文章并统计数据
    const { count, rows } = await Article.findAndCountAll(condition);

    // 统计分页信息
    const totalPages = Math.ceil(count / pageSize);
    const articles = rows;

    return {
        pagination: {
            currentPage,             // 当前页
            pageSize,                // 每页记录数
            totalRecords: count,     // 总记录数
            totalPages,              // 总页数   
        },
        articles
    };
};

// 获取文章详情接口
exports.getArticleDetail = async (articleId) => {
    // 校验ID
    if (!articleId || isNaN(Number(articleId))) {
        throw new AppError('文章ID无效', 400, 'INVALID_ARTICLE_ID');
    }
    // 查找文章记录
    const article = await Article.findByPk(articleId);
    if (!article) {
        return null; // 文章不存在
    }
    await article.increment('views'); // 观看数增加
    // 返回文章详情
    return article;
};


/**
 * @description 获取当前用户发布的所有文章接口
 * @param {Object} req - 请求对象
 * @param {Object} req.user - 用户信息
 * @param {Object} query - 查询参数
 * @param {number} [query.currentPage] - 当前页码（可选）
 * @param {number} [query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 用户发布的所有文章列表及分页信息
 */
exports.getCurrentUserArticles = async (userInfo, query = {}) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    if (!userInfo || !userInfo.name) {
        throw new AppError("用户不存在", 404, "USER_NOT_FOUND");
    }
    
    // 先查用户表，获取用户主键 id
    const dbUser = await User.findOne({ where: { stu_id: userInfo.name } });
    if (!dbUser) {
        throw new AppError("用户不存在", 404, "USER_NOT_FOUND");
    }
    
    // 用用户 id 查文章表，分页查询
    const { count, rows } = await Article.findAndCountAll({
        where: {
            author_id: dbUser.id,
        },
        order: [["createdAt", "DESC"]],
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
        articles: rows,
    };
};


// 新增文章接口
exports.addArticle = async (title, textUrl, userInfo, coverUrl, coverWidth, coverHeight) => {
    if (!title || !textUrl) {
        throw new AppError('未传入title或textUrl', 400, 'MISSING_TITLE_OR_TEXT_URL');
    }

    // 查找用户
    const userId = await User.findOne({ where: { stu_id: userInfo.name } });
    if (!userInfo) {
        throw new AppError('学生ID不存在', 404, 'STUID_NOT_FOUND');
    }

    // 创建文章
    const article = await Article.create({
        title,
        text_md_url: textUrl,
        author_id: userId.id,
        author: userInfo.displayName,
        cover_url: coverUrl,
        cover_width: coverWidth || null,
        cover_height: coverHeight || null,
        department: userInfo.groups[1],
    });

    return article;
}

// 更新文章接口
exports.updateArticle = async (articleId, stuId, body, userGroups) => {
    if (!articleId || isNaN(Number(articleId))) {
        throw new AppError('文章ID无效', 400, 'INVALID_ARTICLE_ID');
    }

    const article = await Article.findByPk(articleId);
    if (!article) {
        throw new AppError('文章不存在', 404, 'ARTICLE_NOT_FOUND');
    }

    // 权限校验：用户只能更新自己的文章，1级权限管理员无限制
    const userLevel = Math.min(...userGroups.map(g => (groupMeta[g]?.level ?? 99)));
    if (userLevel !== 1) {
        const userInfo = await User.findByPk(article.author_id);
        if (userInfo.stu_id !== stuId) {
            throw new AppError('文章作者与学生ID不匹配', 403, 'AUTHOR_MISMATCH');
        }
    }

    if (!body) {
        throw new AppError('缺少更新内容', 400, 'MISSING_UPDATE_CONTENT');
    }

    if (body.textUrl !== undefined) {
        article.text_md_url = body.textUrl;
    }
    if (body.title !== undefined) {
        article.title = body.title;
    }
    if (body.coverUrl !== undefined) {
        article.cover_url = body.coverUrl;
    }
    await article.save();

    return article;
};

// 删除文章接口(软删除)
exports.deleteArticle = async (articleIds, stuId, userGroups) => {
    // 兼容单个ID和ID数组
    const idArray = Array.isArray(articleIds) ? articleIds : [articleIds];
    
    if (idArray.length === 0) {
        throw new AppError('文章ID无效', 400, 'INVALID_ARTICLE_ID');
    }
    
    // 查找所有文章
    const articles = await Article.findAll({
        where: { id: idArray }
    });
    
    if (articles.length === 0) {
        throw new AppError('未找到任何文章', 404, 'ARTICLE_NOT_FOUND');
    }
    
    // 权限校验
    const userLevel = Math.min(...userGroups.map(g => (groupMeta[g]?.level ?? 99)));
    
    if (userLevel !== 1) {
        // 获取用户信息
        const userIds = [...new Set(articles.map(article => article.author_id))];
        const users = await User.findAll({ where: { id: userIds } });
        
        // 检查是否有权限删除所有文章
        const unauthorizedArticles = articles.filter(article => {
            const author = users.find(u => u.id === article.author_id);
            return author && author.stu_id !== stuId;
        });
        
        if (unauthorizedArticles.length > 0) {
            throw new AppError('您不能删除他人发布的文章', 403, 'AUTHOR_MISMATCH');
        }
    }
    
    // 批量软删除文章
    await Promise.all(articles.map(article => article.destroy()));
    
    return {
        deletedCount: articles.length,
        deletedIds: articles.map(a => a.id),
    };
};
