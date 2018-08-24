const KError = require('./kError')

export class ServerError extends KError {
  constructor(additional_data) {
        super(additional_data);
        this.additional_data = additional_data;
        this.reason = "server_error";
    }
}