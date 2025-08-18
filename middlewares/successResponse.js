function successResponse(req, res, next) {
  res.success = function (data = null,status = 200, message = '操作成功', code = 'SUCCESS') {
    res.status(status).json({
      success: true,
      data: {
        message,
        code,
        data: data
      }
    });
  };
  next();
}

module.exports = successResponse;