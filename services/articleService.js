const { Article,User } = require('../models');

// 获取文章列表接口
exports.getArticles = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 校验stuId是否为数字
    if (query.stuId && isNaN(Number(query.stuId))) {
        throw new Error('获取文章失败 学生ID输入错误');
    }

    // 设置查询条件
    const where = {};
    if (query.stuId) {
        const userInfo = await User.findOne({
            where: { stu_id: query.stuId }
        });
        if (!userInfo) {
            throw new Error('获取文章失败 学生ID不存在');
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
            currentPage,
            pageSize,
            totalRecords: count,
            totalPages,
        },
        articles
    };
};