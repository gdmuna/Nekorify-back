const { getUserInfo } = require('../utils/casdoorUtils');
const apiProtected = require('./apiProtected'); // 假设路径为 ./apiProtected

module.exports = function isLogin() {
    return async (req, res, next) => {
        // 如果有 Authorization 请求头，则调用 apiProtected 中间件
        if (req.headers.authorization) {
            return apiProtected(req, res, next);
        }
        // 没有则直接放行
        next();
    };
};
