const KError = require('./kError')

module.exports = class ServerError extends KError {
  constructor(additional_data) {
        super();
        this.additional_data = additional_data;
        this.reason = "server_error";
    }
}