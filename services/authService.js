const casdoorUtils = require('../utils/casdoorUtils');

/**
 * 获取 Casdoor 登录授权链接
 * @returns {string} 登录授权 URL
 */
/**
 * 获取 Casdoor 登录授权链接（根据请求头动态设置 redirect_uri）
 * @param {object} req - Express 请求对象
 * @returns {string} 登录授权 URL
 */
exports.getLoginUrl = (req) => {
    // 从请求头取 Origin 或 Referer
    const origin =
        req.headers.origin ||
        (req.headers.referer ? new URL(req.headers.referer).origin : null);

    // 默认使用环境变量中的重定向地址，如果没有则使用正式环境的前端地址
    let redirectUri = process.env.CASDOOR_REDIRECT_URL || "https://im.gdmuna.com/loginCallback";

    // 如果能识别到 origin，就替换成它的 loginCallback 路径
    if (origin) {
        redirectUri = `${origin}/loginCallback`;
    }

    return (
        process.env.CASDOOR_ENDPOINT +
        "/login/oauth/authorize" +
        `?client_id=${process.env.CASDOOR_CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=read` +
        `&state=${process.env.CASDOOR_STATE}`
    );
};

/**
 * 处理 Casdoor 登录回调
 * @param {string} code - 授权码
 * @returns {Promise<object>} 用户信息和 token
 */
exports.handleCallback = async (code) => {
    return await casdoorUtils.handleCallBack(code);
};

/**
 * 刷新 AccessToken
 * @param {string} refreshToken - 刷新令牌
 * @returns {Promise<object>} 新的 token 信息
 */
exports.refreshToken = async (refreshToken) => {
    return await casdoorUtils.refreshToken(refreshToken);
};

/** * 获取用户信息
 * @param {string} accessToken - 访问令牌
 * @return {Promise<object>} 用户信息
 */
exports.getUserInfo = async (accessToken) => {
    return await casdoorUtils.getUserInfo(accessToken);
}
