/**
 * 请求成功
 * @param res
 * @param message
 * @param data
 * @param code
 */
function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        success: true,
        message,
        data
    });
}

/**
 * 请求失败
 * @param res
 * @param error
 */
function failure(res, error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        return res.status(400).json({
            success: false,
            message: error.message,
            errors
        });
    }

    if (error.name === 'BadRequestError') {
        return res.status(400).json({
            succsee: false,
            message: error.message,
            errors: [error.detail]
        });
    }

    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: error.message,
            errors: [error.detail]
        });
    }

    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            success: false,
            message: error.message,
            errors: [error.detail]
        });
    }

    res.status(500).json({
        status: false,
        message: '服务器错误',
        errors: [error.message]
    });

}

module.exports = {
    success,
    failure
}