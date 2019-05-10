/**
 * @class [Rpc-Error]
 * @extends Error
 */
export class RpcError extends Error {
  json: any
  // Detailed error information
  constructor(json: {
    error: { details: { message: string | undefined }[] }
    processed: { except: { message: string | undefined } }
    message: string | undefined
    statusText: string | undefined
  }) {
    if (
      json.error &&
      json.error.details &&
      json.error.details.length &&
      json.error.details[0].message
    ) {
      super(json.error.details[0].message)
    } else if (
      json.processed &&
      json.processed.except &&
      json.processed.except.message
    ) {
      super(json.processed.except.message)
    } else if (json.message) {
      super(json.message)
    } else if (json.statusText) {
      super(json.statusText)
    } else {
      super('Unknow Error!')
    }
    Object.setPrototypeOf(this, RpcError.prototype)
    this.json = json
  }
}

/**
 * @class [Http]
 * @constructs _fetch  // user incoming
 * @constructs endpoint string // user incoming
 * @constructs path string  // URL path
 */
export class Http {
  _fetch: any
  endpoint: string
  /**
   * @func http-Fetch-function
   * @param [*body] object  // request body
   * @returns [result]  // response => result
   */
  public async httpFetch(path: string, body: object) {
    let response: any
    let result: any
    try {
      console.log(`[fetch] ${path}:\n`, body)
      // request
      response = await this._fetch(this.endpoint + '/v1' + path, {
        body: JSON.stringify(body),
        method: 'POST'
      })
      // console.log('[fetch] Response:', response)
      // handle
      if (response.status >= 400) {
        console.log('[fetch] Error: status >= 400')
        result.code = response.status
        result.statusText = response.statusText
        throw new RpcError(result)
      }
      result = await response.json()
      console.log('[fetch] Result:', result)
      if (result.code !== 0) {
        console.log('[fetch] Error: code !== 0')
        throw new RpcError(result)
      }
    } catch (e) {
      e.isFetchError = true
      throw e
    }
    if (!response.ok) {
      throw new RpcError(result)
    }
    return result
  }
  constructor(_fetch: any, endpoint: string) {
    if (!_fetch) {
      throw new Error('RPC.fetch is required!')
    }
    if (!endpoint) {
      throw new Error('RPC.endpoint is required!')
    }
    this._fetch = _fetch
    this.endpoint = endpoint
  }
}
