const KError = require('./kError')

module.exports = class requestLimitError extends KError {
  constructor() {
        super();
        this.additional_data =  "Retry in 60 seconds";
        this.reason = "request_limit";
    }
}