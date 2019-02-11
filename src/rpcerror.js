/**
 *

 * @export
 * @class RpcError
 * @extends {Error}
 */

export default class RpcError extends Error {
  /** Detailed error information */

  constructor(json) {
    if (
      json.error &&
      json.error.details &&
      json.error.details.length &&
      json.error.details[0].message
    ) {
      super(json.error.details[0].message);
    } else if (
      json.processed &&
      json.processed.except &&
      json.processed.except.message
    ) {
      super(json.processed.except.message);
    } else if (json.message) {
      super(json.message);
    } else if (json.statusText) {
      super(json.statusText);
    } else {
      super('Unknow Error!');
    }
    Object.setPrototypeOf(this, RpcError.prototype);
    this.json = json;
  }
}
