import { opcode } from './data'
import { hash256 } from './crypto/hash'

const { OP_PUSH_DATA1, OP_PUSH_DATA2, OP_PUSH_DATA4 } = opcode
const OP_CODE_TYPE = 'hex'

export const getNumberByte = (num: number) => num & 255
const gethexByteWithNumber = (num: number) => (num & 255).toString(16)

/**
 * @export putUint16
 * @param [*bytes]
 * @param [*uint16]
 * @returns [bytes]
 */
export const putUint16 = (bytes: any = [], uint16: any) => {
  if (bytes.length < 2) {
    return new Error('The length of the bytes should more than 2!')
  }
  bytes[0] = getNumberByte(uint16)
  bytes[1] = uint16 >> 8
  return bytes
}

/**
 * @export putUint32
 * TODO: it not support int32 now!!!
 * @param [*bytes]
 * @param [*uint32]
 * @returns [bytes]
 */
export const putUint32 = (bytes: any = [], uint32: number) => {
  if (bytes.length < 4) {
    return new Error('The length of the bytes should more than 4!')
  }
  bytes[0] = getNumberByte(uint32)
  bytes[1] = uint32 >> 8
  bytes[2] = uint32 >> 16
  bytes[3] = uint32 >> 24
  return bytes
}

/**
 * @export addOperand
 * @param [*strBuf] Buffer | Uint8Array
 * @param [*operand] Buffer
 * @returns Buffer
 */
export function addOperand(strBuf: Buffer | Uint8Array, operand: Buffer) {
  const dataLen = operand.length
  const dataLen_str = gethexByteWithNumber(dataLen)
  if (dataLen < OP_PUSH_DATA1) {
    strBuf = Buffer.from(
      strBuf.toString(OP_CODE_TYPE) + dataLen_str,
      OP_CODE_TYPE
    )
  } else if (dataLen <= 0xff) {
    strBuf = Buffer.concat([
      strBuf,
      Buffer.from(gethexByteWithNumber(OP_PUSH_DATA1), OP_CODE_TYPE),
      Buffer.from(dataLen_str, OP_CODE_TYPE)
    ])
  } else if (dataLen <= 0xffff) {
    let buf = Buffer.alloc(2)
    buf = putUint16(buf, dataLen)
    strBuf = Buffer.concat([
      strBuf,
      Buffer.from(gethexByteWithNumber(OP_PUSH_DATA2), OP_CODE_TYPE),
      buf
    ])
  } else {
    let buf = Buffer.alloc(4)
    buf = putUint16(buf, dataLen)
    strBuf = Buffer.concat([
      strBuf,
      Buffer.from(gethexByteWithNumber(OP_PUSH_DATA4), OP_CODE_TYPE),
      buf
    ])
  }

  // Append the actual operand
  return Buffer.concat([strBuf, operand])
}

/**
 * @export signatureScript
 * @param [*sigBuf] Buffer
 * @param [*Buffer] Buffer
 * @returns [end] Buffer
 */
export const signatureScript = (sigBuf: Buffer, pubKeyBuf: Buffer) => {
  const before = addOperand(Buffer.from([]), sigBuf)
  const end = addOperand(before, pubKeyBuf)
  console.log('before:', before.toString(OP_CODE_TYPE))
  return end
}

/**
 * @export getSignHash
 * @param [*protobuf] string
 * @returns
 */
export const getSignHash = (protobuf: string) => {
  return hash256(Buffer.from(protobuf, 'base64'))
}

// fetchTokenUtxos todo
// fetchUtxos todo

/**
 * @exportClass [Rpc-Error]
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

export class Rpc {
  _fetch: any
  endpoint: string
  constructor(_fetch: any, endpoint: string) {
    console.log('flag _fetch:', _fetch)
    if (!_fetch) {
      throw new Error('rpc.fetch is required!')
    }
    if (!endpoint) {
      throw new Error('rpc.endpoint is required!')
    }
    this._fetch = _fetch
    this.endpoint = endpoint
  }
}

export const fetch = async (
  _fetch: any,
  endpoint: string,
  path: string,
  body: object = {}
) => {
  console.log('_fetch param._fetch:', _fetch)
  console.log('_fetch param.endpoint:', endpoint)
  console.log('_fetch param.path:', path)
  console.log('_fetch param.body:', body)
  // console.log(`[fetch:${path}]:\n`, JSON.stringify(body), '\n')
  let res
  let json: any = {
    path
  }
  try {
    res = await _fetch(endpoint + '/v1' + path, {
      body: JSON.stringify(body),
      method: 'POST'
    })
    console.log('fetch res:', res)
    if (res.status >= 400) {
      console.log('fetch:1')
      json.code = res.status
      json.statusText = res.statusText
      throw new RpcError(json)
    }
    if (json.code !== 0) {
      console.log('fetch:2')
      throw new RpcError(json)
    }
    json = res.json()
  } catch (e) {
    e.isFetchError = true
    throw e
  }
  if (!res.ok) {
    throw new RpcError(json)
  }
  return json
}
