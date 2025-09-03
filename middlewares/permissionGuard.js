const { User } = require("../models");
const AppError = require("../utils/AppError");
const groupMeta = require("../config/groupMeta");

// 数据服务层映射
const serviceMap = {
    announcement: require("../services/announcementService"),
    article: require("../services/articleService"),
    message: require("../services/messageService"),
    replay: require("../services/replayService"),
    schedule: require("../services/scheduleService"),
    task: require("../services/taskService"),
    // 可拓展更多操作对象...
};

/**
 * 通用权限校验中间件
 * @param {Object} options
 * @param {string} options.type 数据类型（如 'article'、'task'）
 * @param {string} options.action 操作类型（如 'add', 'update', 'delete'）
 * @param {number} options.minLevel 允许的最小等级（如:3实际表示允许1、2、3级权限人员进行操作）
 */
module.exports = function permission(options = {}) {
    return async (req, res, next) => {
        // 校验参数
        const service = serviceMap[options.type];
        if (!service) throw new AppError("未知的操作类型", 400, "UNKNOWN_TYPE");

        try {
            if(!req.user)
            {
                next();
                return;
            }
            // 获取用户信息
            const { type, action, minLevel = 99 } = options;
            const userGroups = req.user.groups || [];
            const userLevel = Math.min(
                ...userGroups.map((g) => groupMeta[g]?.level ?? 99)
            );
            // 超级管理员权限
            const isSuperAdmin = userLevel === 0;

            // 新增操作
            if (action === "add") {
                if (
                    !userGroups.some(
                        (g) => groupMeta[g] && groupMeta[g].level <= minLevel
                    )
                ) {
                    throw new AppError(`您没有权限添加${type}数据`, 403, "NO_PERMISSION");
                }
                // 可拓展其他权限控制
                return next();
            }

            // 更新操作
            if (action === "update") {
                if (
                    !userGroups.some(
                        (g) => groupMeta[g] && groupMeta[g].level <= minLevel
                    )
                ) {
                    throw new AppError(`您没有权限更新${type}数据`, 403, "NO_PERMISSION");
                }
                // 可拓展其他权限控制
            }

            // 删除操作
            if (action === "delete") {
                if (
                    !userGroups.some(
                        (g) => groupMeta[g] && groupMeta[g].level <= minLevel
                    )
                ) {
                    throw new AppError(`您没有权限删除${type}数据`, 403, "NO_PERMISSION");
                }
                // 可拓展其他权限控制
            }

            // 可拓展其他操作
            next();
        } catch (error) {
            next(error);
        }
    };
};
