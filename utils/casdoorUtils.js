const casdoor = require('../config/casdoorConfigs');
const AppError = require('../utils/AppError');

exports.handleCallBack = async function(code) {
    try {
            const TokenResponse = await casdoor.getAuthToken(code);
            console.log('获取到的Token响应:', TokenResponse);
            const JWTtoken = TokenResponse.access_token;
            if (!JWTtoken) {
            throw new Error('获取OAuth URL失败');
            }
            const userInfo = casdoor.parseJwtToken(JWTtoken);
            console.log('解析后的用户信息:', userInfo);
            if (!userInfo) {
                throw new Error('解析JWT Token失败');
            }
            return {
                token: TokenResponse,
                userInfo: userInfo,
            };
    } catch (error) {
            console.error('登录失败:', error);
            return {
                success: false,
                message: error.response.data.error_description || '登录失败，请稍后再试',
            };
    }
};

// 刷新AccessToken
exports.refreshToken = async function(data) {
    try {
        const response = await casdoor.refreshToken(data);

        // 修正判断，避免 undefined 报错
        if (response.error && response.error.data) {
            throw new Error('刷新AccessToken失败');
        }
        console.log('刷新AccessToken响应:', response);
        return response;
    } catch (error) {
        let msg = error?.response?.data?.error_description || error.message || '刷新AccessToken失败，请稍后再试';
        let code = error?.response?.data?.error || 'REFRESH_TOKEN_FAILED';
        let status = error?.response?.status || 400;
        throw new AppError(msg, status, code);
    }
};

// 获取用户信息
exports.getUserInfo = async function(accessToken) {
    try {
        const userInfo = await casdoor.parseJwtToken(accessToken);
        console.log('获取到的用户信息:', userInfo);
        return (userInfo);
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return (error);
    }
};