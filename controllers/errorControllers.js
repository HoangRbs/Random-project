exports.NotFoundUrl = (req, res, next) => {
  const err = new Error(`cound not find the url ${req.originalUrl}`);
  err.statusCode = 404;
  err.status = 'failed';
  next(err);
};

exports.globalErrHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};
