const casdoor = require('../config/casdoorConfigs');

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
                success: true,
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
    