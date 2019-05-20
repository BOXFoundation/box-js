/**
 * @func http-Fetch-function
 * @param [*body] object  // request body
 * @returns [result]  // response => result
 */
const httpFetch = async (path, body, _fetch, endpoint) => {
  let response
  let result
  try {
    // console.log(`[fetch] ${path}:\n`, JSON.stringify(body))
    // request
    response = await _fetch(endpoint + '/v1' + path, {
      body: JSON.stringify(body),
      method: 'POST'
    })
    // console.log('[fetch] response:', response)
    // handle
    if (response.status >= 400) {
      // console.log('[fetch] Error: status >= 400')
      result.code = response.status
      result.statusText = response.statusText
      throw new HttpError(result)
    }
    result = await response.json()
    // console.log('[fetch] Result:', result)
    if (result.code) {
      if (result.code === 0) {
        delete result.code
        delete result.message
      } else {
        // console.log('[fetch] Error: code !== 0')
        throw new HttpError(result)
      }
    } else {
      delete result.code
      delete result.message
    }
  } catch (err) {
    err.isFetchError = true
    throw err
  }
  if (!response.ok) {
    throw new HttpError(result)
  }
  return result
}

const rpcFetch = (path, body, _fetch, endpoint) => {
  console.log('rpcFetch:', path, body, _fetch, endpoint)
}

/**
 * @class [Http-Error]
 * @extends Error
 */
class HttpError extends Error {
  json
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
    Object.setPrototypeOf(this, HttpError.prototype)
    this.json = json
  }
}

/**
 * @class [Http]
 * @constructs _fetch  // user incoming
 * @constructs endpoint string // user incoming
 * @constructs path string  // URL path
 */
export class Fetch {
  _fetch
  endpoint: string
  fetch_type: string

  constructor(_fetch, endpoint, fetch_type) {
    if (!_fetch) {
      throw new Error('RPC.fetch is required!')
    }
    if (!endpoint) {
      throw new Error('RPC.endpoint is required!')
    }
    this._fetch = _fetch
    this.endpoint = endpoint
    this.fetch_type = fetch_type
  }

  public async fetch(path: string, body: object = {}) {
    if (this.fetch_type === 'rpc') {
      return rpcFetch(path, body, this._fetch, this.endpoint)
    } else {
      return httpFetch(path, body, this._fetch, this.endpoint)
    }
  }
}
