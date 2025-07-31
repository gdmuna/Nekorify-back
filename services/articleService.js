const { Article, User } = require('../models');
const AppError = require('../utils/AppError');
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

// 新增文章接口
exports.addArticle = async (title, textUrl, userInfo, cover_url, ) => {
    if (!title || !textUrl || !cover_url) {
        throw new AppError('缺少属性', 400, 'MISSING_TITLE_OR_TEXT_URL_OR_COVER_URL');
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
        cover_url: cover_url, 
        department: userInfo.groups[1], 
    });

    return article;
}

// 更新文章接口
exports.updateArticle = async (articleId, stuId, body) => {
    if (!articleId || isNaN(Number(articleId))) {
        throw new AppError('文章ID无效', 400, 'INVALID_ARTICLE_ID');
    }

    const article = await Article.findByPk(articleId);  
    if (!article) {
        throw new AppError('文章不存在', 404, 'ARTICLE_NOT_FOUND');
    }

    const userInfo = await User.findByPk(article.author_id);
    if (userInfo.stu_id !== stuId) {
        throw new AppError('文章作者与学生ID不匹配', 403, 'AUTHOR_MISMATCH');
    }

    if (!body) {
        throw new AppError('缺少更新内容', 400, 'MISSING_UPDATE_CONTENT');
    }

    article.text_md_url = body.updateUrl;
    article.title = body.title;
    article.cover_url = body.coverUrl;
    await article.save();

    return article;
};

// 删除文章接口(软删除)
exports.deleteArticle = async (articleId,stuId) => {
    // 校验ID
    if (!articleId || isNaN(Number(articleId))) {
        throw new AppError('文章ID无效', 400, 'INVALID_ARTICLE_ID');
    }

    // 查找文章
    const article = await Article.findByPk(articleId);
    if (!article) {
        throw new AppError('文章不存在', 404, 'ARTICLE_NOT_FOUND');
    }

    const userInfo = await User.findByPk(article.author_id);
    console.log('用户信息:', userInfo);
    if(userInfo.stu_id !== stuId) {
        throw new AppError('文章作者与学生ID不匹配', 403, 'AUTHOR_MISMATCH');
    }
    
    // 软删除文章
    await article.destroy();
    return(article); // 返回被删除的文章信息
};
