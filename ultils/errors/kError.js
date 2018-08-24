
export class KError extends Error{
  constructor() {
        this.error = true;
        Error.captureStackTrace(this, this.constructor);
    }
}