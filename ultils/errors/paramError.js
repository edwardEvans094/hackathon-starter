const KError = require('./kError')

module.exports = class ParamError extends KError {
  constructor(additional_data) {
        super();
        this.additional_data = additional_data;
        this.reason = "param_error";
    }
}