const casdoor = require('../config/casdoorconfig');
const casdoorUtils = require('../utils/casdoorUtils');


//获取casdoor登录地址并跳转
exports.getLoginUrl = (req, res) => {
    try {
        
        //拼接登录链接
        const loginUrl = process.env.CASDOOR_ENDPOINT + '/login/oauth/authorize' +
            `?client_id=${process.env.CASDOOR_CLIENT_ID}` + `&response_type=code` +
            `&redirect_uri=${process.env.CASDOOR_REDIRECT_URL}` +`&scope=read`+ `&state=${process.env.CASDOOR_STATE}`;
        console.log('登录地址:', loginUrl);
        res.redirect(loginUrl);
    }catch (error) {
        console.error('获取登录地址失败:', error);
        res.status(500).json({
            success: false,
            message: '获取登录地址失败，请稍后再试'
        });
    }
    
}

//处理casdoor登录回调
exports.handelCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code) {
            return res.status(400).json({
                success: false,
                message: '缺少授权码'
            });
        }

        console.log('登录回调参数:', { code, state });

        // 传递 code 和 state
        const result = await casdoorUtils.handleCallBack(code, state);
        if (!result.success) {
            return res.status(401).json({
                success: false,
                message: result.message || '登录失败，无法获取用户信息'
            });
        }

        console.log('获取到的用户信息:', result.userInfo);
        // 登录成功，返回用户信息
        res.json(result);
    } catch (error) {
        console.error('登录回调处理失败:', error);
        res.status(500).json({
            success: false,
            message: '登录回调处理失败，请稍后再试'
        });
    }
}