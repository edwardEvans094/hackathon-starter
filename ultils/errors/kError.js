
module.exports = class KError extends Error{
  constructor() {
        super()
        this.error = true;
        Error.captureStackTrace(this, this.constructor);
    }
}