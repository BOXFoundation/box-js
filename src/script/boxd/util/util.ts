import { opcode } from './core'
import { hash256 } from './crypto/hash'

const OPPUSHDATA1 = opcode.OPPUSHDATA1
const OPPUSHDATA2 = opcode.OPPUSHDATA2
const OPPUSHDATA4 = opcode.OPPUSHDATA4
const op_hash_len = 32

const getNunberByte = (num: number) => num & 255
const gethexByteWithNumber = (num: number) => {
  return Number((num & 255).toString(16))
}

/**
 * putUint16
 *
 * @param {*} [bytes=[]]
 * @param {*} uint16
 * @returns
 */
const putUint16 = (bytes: any = [], uint16: any) => {
  if (bytes.length < 2) {
    return new Error('The length of the bytes should more than 2!')
  }
  bytes[0] = getNunberByte(uint16)
  bytes[1] = uint16 >> 8
  return bytes
}

/**
 * putUint32
 * TODO: it not support int32 now!!!
 *
 * @param {*} [bytes=[]]
 * @param {*} uint16
 * @returns
 */
const putUint32 = (bytes: any = [], uint32: number) => {
  if (bytes.length < 4) {
    return new Error('The length of the bytes should more than 4!')
  }
  bytes[0] = getNunberByte(uint32)
  bytes[1] = uint32 >> 8
  bytes[2] = uint32 >> 16
  bytes[3] = uint32 >> 24
  return bytes
}

function getUint32(b: number[]) {
  return b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)
}

/**
 * addOperand
 *
 * @param {Buffer} [str]
 * @param {Buffer} [operand]
 * @returns
 */
function addOperand(strBuf: Buffer | Uint8Array, operand: Buffer) {
  const dataLen = operand.length
  if (dataLen < OPPUSHDATA1) {
    const b1 = gethexByteWithNumber(dataLen)
    strBuf = Buffer.from(strBuf.toString('hex') + b1, 'hex')
  } else if (dataLen <= 0xff) {
    strBuf = Buffer.concat([
      strBuf,
      [
        gethexByteWithNumber(Number(OPPUSHDATA1)),
        gethexByteWithNumber(Number(dataLen))
      ]
    ])
  } else if (dataLen <= 0xffff) {
    let buf = Buffer.alloc(2)
    buf = putUint16(buf, dataLen)
    strBuf = Buffer.concat([strBuf, [gethexByteWithNumber(OPPUSHDATA2)], buf])
  } else {
    let buf = Buffer.alloc(4)
    buf = putUint16(buf, dataLen)
    strBuf = Buffer.concat([strBuf, [gethexByteWithNumber(OPPUSHDATA4)], buf])
  }

  // Append the actual operand
  return Buffer.concat([strBuf, operand])
}

/**
 * signatureScript
 *
 * @param {Buffer} sigBuf
 * @param {Buffer} pubKeyBuf
 * @returns
 */
const signatureScript = (sigBuf: Buffer, pubKeyBuf: Buffer) => {
  const before = addOperand(Buffer.from([]), sigBuf)
  const end = addOperand(before, pubKeyBuf)
  console.log('before:', before.toString('hex'))
  return end
}

const getSignHash = protobuf => {
  return hash256(Buffer.from(protobuf, 'base64'))
}

/**
 * @func 编码成token_address
 * @param {* opHash}
 * @param {* index}
 * @returns {token_address [Buffer]}
 */
const encodeTokenAddrBuf = (opHash: any, index: any): Buffer => {
  const before = Buffer.from(opHash, 'hex')
  const end = putUint32(Buffer.alloc(4), Number(index))
  return Buffer.concat([before, Buffer.from(':'), end])
}

/**
 * @func token_add_buf解析成hash+index
 * @param {* token_add_buf [Buffer]}
 * @returns {hash index}
 */
const decodeTokenAddrBuf = (token_add_buf: any): object => {
  const opHash = token_add_buf.slice(0, op_hash_len).toString('hex')
  const index = getUint32(token_add_buf.slice(op_hash_len + 1))
  return {
    opHash,
    index
  }
}

/**
 * @exportClass [Rpc-Error]
 * @extends Error
 */

export default class RpcError extends Error {
  json
  // Detailed error information
  constructor(json) {
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

module.exports = {
  signatureScript,
  getSignHash,
  putUint16,
  getNunberByte,
  putUint32,
  addOperand,
  encodeTokenAddrBuf,
  decodeTokenAddrBuf
}
