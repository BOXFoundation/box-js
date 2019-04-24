import { opcode } from './core'
import { hash256 } from './crypto/hash'

const { OP_PUSH_DATA1, OP_PUSH_DATA2, OP_PUSH_DATA4, OP_ENCODE } = opcode

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
    strBuf = Buffer.from(strBuf.toString(OP_ENCODE) + dataLen_str, OP_ENCODE)
  } else if (dataLen <= 0xff) {
    strBuf = Buffer.concat([
      strBuf,
      Buffer.from(gethexByteWithNumber(OP_PUSH_DATA1), OP_ENCODE),
      Buffer.from(dataLen_str, OP_ENCODE)
    ])
  } else if (dataLen <= 0xffff) {
    let buf = Buffer.alloc(2)
    buf = putUint16(buf, dataLen)
    strBuf = Buffer.concat([
      strBuf,
      Buffer.from(gethexByteWithNumber(OP_PUSH_DATA2), OP_ENCODE),
      buf
    ])
  } else {
    let buf = Buffer.alloc(4)
    buf = putUint16(buf, dataLen)
    strBuf = Buffer.concat([
      strBuf,
      Buffer.from(gethexByteWithNumber(OP_PUSH_DATA4), OP_ENCODE),
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
  console.log('before:', before.toString(OP_ENCODE))
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
