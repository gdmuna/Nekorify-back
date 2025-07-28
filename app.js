// 内置模块
require('dotenv').config();

// 第三方中间件
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// 自定义中间件
const errorHandlerMiddleware = require('./middlewares/errorHandleMiddleware');
const successResponse = require('./middlewares/successPresponse');
const authMiddleware = require('./middlewares/authMiddleware');

// 路由
const router = require('./routes/index');


const app = express();
// 成功响应中间件
app.use(successResponse);
//允许跨域访问
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// 鉴权中间件
app.use(authMiddleware);
// 接口路由
app.use('/api', router);
// 错误处理中间件
app.use(errorHandlerMiddleware);
module.exports = app;
