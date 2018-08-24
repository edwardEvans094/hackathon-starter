const KError = require('./kError')

export class ParamError extends KError {
  constructor(additional_data) {
        super(additional_data);
        this.additional_data = additional_data;
        this.reason = "param_error";
    }
}