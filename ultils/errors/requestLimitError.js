const KError = require('./kError')

export class requestLimitError extends KError {
  constructor() {
        this.additional_data =  "Retry in 60 seconds";
        this.reason = "request_limit";
    }
}