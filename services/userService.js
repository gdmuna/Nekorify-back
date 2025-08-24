const { User } = require("../models");
const AppError = require("../utils/AppError");

/**
 * 根据用户名查找用户信息
 * @param {string} stuId 学号
 * @returns {Promise<Object|null>} 用户对象或 null
 */
exports.getUserBystuId = async (stuId) => {
    if (!stuId) {
        throw new AppError("学号无效", 400, "INVALID_USER_NAME");
    }
    const user = await User.findOne({ where: { stu_id: stuId } });
    if (!user) {
        return null; // 用户不存在
    }
    return user;
}


module.exports = {
    getUserByStuId,
    // 其他导出
};
// ...