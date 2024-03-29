/**
 * @class [Http-Error]
 * @extends Error
 */
class HttpError extends Error {
  public json
  // Detailed error information
  public constructor(json: {
  error: { details: { message: string | undefined }[] };
  processed: { except: { message: string | undefined } };
  message: string | undefined;
  statusText: string | undefined;
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
      super('Unknow Error !')
    }
    Object.setPrototypeOf(this, HttpError.prototype)
    this.json = json
  }
}

/**
 * @func Http_handler_of_Fetch
 * @param [*path] # request url
 * @param [*body] # request body
 * @param [*_fetch]
 * @param [*endpoint]
 * @returns [result]  # response -> result
 */
const httpFetch = async (path, body, _fetch, endpoint) => {
  let response
  let result
  try {
    // console.log(`[fetch] ${path}:\n`, JSON.stringify(body))
    /* request */
    response = await _fetch(endpoint + '/v1' + path, {
      body: JSON.stringify(body),
      method: 'POST'
    })
    // console.log('[fetch] response:', response)
    /* handle */
    if (response) {
      if (response.status >= 400) {
        console.log(
          '[fetch] Error: status >= 400 ' +
            response.status +
            ', ' +
            response.statusText
        )
        result = await response.json()
        console.log(result)
        throw new HttpError(result)
      }
      result = await response.json()
      // console.log('[fetch] Result :', result)
      if (result.code) {
        if (result.code === 0) {
          delete result.code
          delete result.message
        } else {
          // console.log('[fetch] Error : code !== 0')
          throw new HttpError(result)
        }
      }
      if (!response.ok) {
        throw new HttpError(result)
      }

      return result
    }
  } catch (err) {
    throw new HttpError(err)
  }
}

const rpcFetch = (path, body, _fetch, endpoint) => {
  console.log('rpcFetch:', path, body, _fetch, endpoint)
}

/**
 * @class [Fetch]
 * @constructs _fetch  // user incoming
 * @constructs endpoint string // user incoming
 * @constructs fetch_type string  // http || rpc
 */
export class Fetch {
  public _fetch
  public endpoint: string
  public fetch_type: string

  public constructor(_fetch, endpoint, fetch_type) {
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
