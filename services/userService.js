const { User } = require("../models");
const AppError = require("../utils/AppError");

/**
 * 根据学号查找用户信息
 * @param {string} stuId 学号
 * @returns {Promise<Object|null>} 用户对象或 null
 */
exports.getUserByStuId = async (stuId) => {
    if (!stuId) {
        throw new AppError("学号无效", 400, "INVALID_STU_ID");
    }
    const userInfo = await User.findOne({ where: { stu_id: stuId } });

    if (!userInfo) {
        return null; // 用户不存在
    }
    return userInfo;
}