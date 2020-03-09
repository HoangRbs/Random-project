// extends error to be able to get passed into express err (err,req,res,next)
class AppError extends Error {
  constructor(errMessage, errCode) {
    super();

    this.message = errMessage;
    this.statusCode = errCode;
    this.status = Math.floor(errCode / 100) === 4 ? 'failed' : 'error';
  }
}

module.exports = AppError;
