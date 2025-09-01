const { noTrueLogging } = require("sequelize/lib/utils/deprecations");
const { Announcement, User } = require("../models");
const AppError = require("../utils/AppError");
const { isValidUrl } = require("../utils/validUrlUtils");
const groupMeta = require("../config/groupMeta");

/**
 * @description 公告服务
 * @module services/announcementService
 */

/**
 * @description 获取公告列表接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数（可选）
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Object>} 公告列表及分页信息
 */
exports.getAnnouncements = async (query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 设置文章查询条件
    const condition = {
        order: [["createdAt", "DESC"]],
        offset,
        limit: pageSize,
    };

    // 查询公告并统计数据
    const { count, rows } = await Announcement.findAndCountAll(condition);

    // 统计分页信息
    const totalPages = Math.ceil(count / pageSize);
    const announcements = rows;

    if (announcements.length === 0) {
        throw new AppError("没有查询到相关公告", 404, "ANNOUNCEMENT_NOT_FOUND");
    }

    return {
        pagination: {
            currentPage, // 当前页
            pageSize, // 每页记录数
            totalRecords: count, // 总记录数
            totalPages, // 总页数
        },
        announcements,
    };
};

/**
 * @description 获取公告详情接口
 * @param {Object} req - 请求对象
 * @param {Object} req.params - 请求参数
 * @param {number} req.params.id - 公告ID
 * @returns {Promise<Object>} 公告详情信息
 */
exports.getAnnouncementDetail = async (announcementId) => {
    // 查询公告
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
        throw new AppError("公告不存在", 404, "ANNOUNCEMENT_NOT_FOUND");
    }
    // 浏览量加一
    announcement.views += 1;
    await announcement.save();
    return announcement;
};

/**
 * @description 获取用户发布的所有公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.query - 查询参数
 * @param {Array<string>} ids - 用户ID数组
 * @param {number} [req.query.currentPage] - 当前页码（可选）
 * @param {number} [req.query.pageSize] - 每页数量（可选）
 * @returns {Promise<Array>} 用户发布的所有公告列表
 */
exports.getUserAnnouncements = async (query) => {
    const ids = Array.isArray(query.ids) ? query.ids : [];
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    if (!Array.isArray(ids) || ids.length === 0) {
        throw new AppError("请提供用户id", 400, "MISSING_USER_ID");
    }

    const { count, rows } = await Announcement.findAndCountAll({
        where: { author_id: ids },
        order: [["createdAt", "DESC"]],
        offset,
        limit: pageSize
    });

    const grouped = {};
    for (const ann of rows) {
        const key = `author_id:${ann.author_id}`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(ann);
    }

    const totalPages = Math.ceil(count / pageSize);

    return {
        pagination: {
            currentPage,
            pageSize,
            totalRecords: count,
            totalPages
        },
        grouped
    };
};


/**
 * @description 获取当前用户发布的所有公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.user - 用户信息
 * @returns {Promise<Array>} 用户发布的所有公告列表
 */
exports.getCurrentUserAnnouncements = async (user, query) => {
    // 获取分页参数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    if (!user || !user.name) {
        throw new AppError("用户不存在", 404, "USER_NOT_FOUND");
    }
    // 先查用户表，获取用户主键 id
    const dbUser = await User.findOne({ where: { stu_id: user.name } });
    if (!dbUser) {
        throw new AppError("用户不存在", 404, "USER_NOT_FOUND");
    }
    // 用用户 id 查公告表，分页查询
    const { count, rows } = await Announcement.findAndCountAll({
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
        announcements: rows,
    };
};

/**
 * @description 新增公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.user - 用户信息
 * @param {Object} req.body - 公告数据
 * @param {string} req.body.title - 公告标题 (必填)
 * @param {string} [req.body.coverUrl] - 公告封面URL (可选)
 * @param {string} [req.body.author] - 公告作者 (必填)
 * @param {string} [req.body.department] - 发布部门 (必填)
 * @param {string} [req.body.textUrl] - 公告Markdown文本URL (必填)
 * @returns {Promise<Object>} 新增的公告信息
 */
exports.createAnnouncement = async (announcementData, userInfo) => {
    // 校验必填字段
    if (!announcementData.title) {
        throw new AppError("缺少公告标题", 400, "MISSING_TITLE");
    }
    if (!announcementData.department) {
        throw new AppError("缺少发布部门", 400, "MISSING_DEPARTMENT");
    }
    if (!announcementData.textUrl) {
        throw new AppError("缺少公告Markdown文本URL", 400, "MISSINGD_URL");
    }
    if (!isValidUrl(announcementData.textUrl)) {
        throw new AppError("公告Markdown文本URL无效", 400, "INVALID_textUrl");
    }
    // 校验可选字段
    if (announcementData.coverUrl && !isValidUrl(announcementData.coverUrl)) {
        throw new AppError("公告封面URL无效", 400, "INVALID_COVER_URL");
    }
    // 查找用户
    const userId = await User.findOne({ where: { stu_id: userInfo.name } });
    if (!userInfo) {
        throw new AppError("用户的学生ID不存在", 404, "STUID_NOT_FOUND");
    }
    // 检验同一作者是否发布过相同标题的公告
    const existingAnnouncement = await Announcement.findOne({
        where: {
            title: announcementData.title,
            author: userInfo.name,
        },
    });
    if (existingAnnouncement) {
        throw new AppError(
            "同一作者已发布过相同标题的公告",
            400,
            "DUPLICATE_ANNOUNCEMENT"
        );
    }

    // 创建公告
    const announcement = await Announcement.create({
        title: announcementData.title,
        author_id: userId.id,
        author: userInfo.displayName,
        department: announcementData.department,
        text_md_url: announcementData.textUrl,
        cover_url: announcementData.coverUrl || null,
    });
    if (!announcement) {
        throw new AppError("新增公告失败", 500, "ANNOUNCEMENT_CREATION_FAILED");
    }
    return announcement;
};

/**
 * @description 修改公告接口
 * @param {Object} req - 请求对象
 * @param {number} req.user.groups - 用户组别，用于校验修改权限
 * @param {number} req.params.id - 公告ID
 * @param {Object} req.body - 更新数据
 * @param {string} [req.body.title] - 公告标题（可选）
 * @param {string} [req.body.coverUrl] - 公告封面URL（可选）
 * @param {string} [req.body.author] - 公告作者（可选）
 * @param {string} [req.body.department] - 发布部门（可选）
 * @param {string} [req.body.textUrl] - 公告Markdown文本URL（可选）
 * @returns {Promise<Object>} 更新后的公告信息
 */
exports.updateAnnouncement = async (
    announcementId,
    updateData,
    displayName,
    userGroups
) => {
    // 检验公告ID是否有效
    if (!announcementId || isNaN(Number(announcementId))) {
        throw new AppError("公告ID无效", 400, "INVALID_ANNOUNCEMENT_ID");
    }

    // 检验传入的更新数据是否有效
    if (!updateData || typeof updateData !== "object") {
        throw new AppError("更新数据无效", 400, "INVALID_UPDATE_DATA");
    }

    // 检验公告是否存在
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
        throw new AppError("公告不存在", 404, "ANNOUNCEMENT_NOT_FOUND");
    }

    // 权限校验：非管理员用户只能修改自己的公告
    const userLevel = Math.min(
        ...userGroups.map((g) => groupMeta[g]?.level ?? 99)
    );
    if (userLevel !== 1) {
        // 用户只能修改自己的公告，1级权限管理员无限制
        const anouncement = await Announcement.findOne({
            where: {
                id: announcementId,
            },
        });
        if (anouncement.author !== displayName) {
            throw new AppError(
                "修改者与公告发布者不匹配",
                403,
                "ANNOUNCEMENT_AUTHOR_MISMATCH"
            );
        }
    }

    // 更新公告
    if (updateData.title !== undefined) announcement.title = updateData.title;
    if (updateData.coverUrl !== undefined)
        announcement.cover_url = updateData.coverUrl;
    if (updateData.author !== undefined) announcement.author = updateData.author;
    if (updateData.department !== undefined)
        announcement.department = updateData.department;
    if (updateData.textUrl !== undefined)
        announcement.text_md_url = updateData.textUrl;

    await announcement.save();

    return announcement;
};

/**
 * @description 删除公告接口
 * @param {Object} req - 请求对象
 * @param {Object} req.user.groups - 用户组别，用于校验修改权限
 * @param {number} req.params.id - 公告ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteAnnouncement = async (
    announcementIds,
    displayName,
    userGroups
) => {
    // 兼容单个ID和ID数组
    const idArray = Array.isArray(announcementIds) 
        ? announcementIds 
        : [announcementIds];
    
    if (idArray.length === 0) {
        throw new AppError("公告ID无效", 400, "INVALID_ANNOUNCEMENT_ID");
    }
    
    // 权限校验：获取用户权限等级
    const userLevel = Math.min(
        ...userGroups.map((g) => groupMeta[g]?.level ?? 99)
    );
    
    // 查找所有公告
    const announcements = await Announcement.findAll({
        where: { id: idArray }
    });
    
    if (announcements.length === 0) {
        throw new AppError("未找到任何公告", 404, "ANNOUNCEMENT_NOT_FOUND");
    }
    
    // 权限校验：如果不是管理员，确保只能删除自己的公告
    if (userLevel !== 1) {
        const notOwnedAnnouncements = announcements.filter(
            ann => ann.author !== displayName
        );
        
        if (notOwnedAnnouncements.length > 0) {
            throw new AppError(
                "您不能删除他人发布的公告",
                403,
                "ANNOUNCEMENT_AUTHOR_MISMATCH"
            );
        }
    }
    
    // 批量软删除公告
    await Promise.all(announcements.map(announcement => announcement.destroy()));
    
    return {
        deletedCount: announcements.length,
        deletedIds: announcements.map(ann => ann.id),
    };
};
