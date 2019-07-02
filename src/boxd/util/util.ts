import bs58 from 'bs58'
import Opcode from './var'
import Verify from './verify'
import Hash from './crypto/hash'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'

const { OP_PUSH_DATA1, OP_PUSH_DATA2, OP_PUSH_DATA4 } = Opcode
const OP_CODE_TYPE = 'hex'
const PREFIXSTR2BYTES = {
  'b1': Buffer.from([0x13, 0x26]),
  'b2': Buffer.from([0x13, 0x28]),
  'b3': Buffer.from([0x13, 0x2a]),
}
const gethexByteWithNumber = (num: number) => (num & 255).toString(16)
/* keccak = BEGIN = */
const KECCAK256_NULL_S =
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
const isHexStrict = hex => {
  return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex)
}
const hexToBytes = hex => {
  hex = hex.toString(16)
  if (!isHexStrict(hex)) {
    throw new Error('Given value "'.concat(hex, '" is not a valid hex string.'))
  }
  hex = hex.replace(/^0x/i, '')
  hex = hex.length % 2 ? '0' + hex : hex
  var bytes: any = []
  for (var c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }

  return bytes
}
/* keccak = END = */
const _flattenTypes = function _flattenTypes(includeTuple, puts) {
  let types: any = []
  puts.forEach(function(param) {
    if (Verify._typeof(param.components) === 'object') {
      if (param.type.substring(0, 5) !== 'tuple') {
        throw new Error(
          'components found but type is not tuple; report on GitHub'
        )
      }
      let suffix = ''
      const arrayBracket = param.type.indexOf('[')
      if (arrayBracket >= 0) {
        suffix = param.type.substring(arrayBracket)
      }
      const result = _flattenTypes(includeTuple, param.components)
      if (isArray(result) && includeTuple) {
        types.push('tuple('.concat(result.join(','), ')').concat(suffix))
      } else if (!includeTuple) {
        types.push('('.concat(result.join(','), ')').concat(suffix))
      } else {
        types.push('('.concat(result, ')'))
      }
    } else {
      types.push(param.type)
    }
  })

  return types
}

namespace Util {
  export const getNumberByte = (num: number) => num & 255

  /**
   * @export put-Uint16
   * @param [*bytes]
   * @param [*uint16]
   * @returns [bytes]
   */
  export const putUint16 = (bytes, uint16: number) => {
    if (bytes.length < 2) {
      return new Error('The length of the bytes should more than 2 !')
    }
    bytes[0] = getNumberByte(uint16)
    bytes[1] = uint16 >> 8

    return bytes
  }

  /**
   * @export add-Operand
   * @param [*strBuf] Buffer | Uint8Array
   * @param [*operand] Buffer
   * @returns Buffer
   */
  const addOperand = (strBuf: Buffer | Uint8Array, operand: Buffer) => {
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
   * @export put-Uint32
   * TODO: it not support int32 now
   * @param [*bytes]
   * @param [*uint32]
   * @returns [bytes]
   */
  export const putUint32 = (bytes, uint32: number) => {
    if (bytes.length < 4) {
      return new Error('The length of the bytes should more than 4 !')
    }
    bytes[0] = getNumberByte(uint32)
    bytes[1] = uint32 >> 8
    bytes[2] = uint32 >> 16
    bytes[3] = uint32 >> 24

    return bytes
  }

  /**
   * @export signature-Script
   * @param [*sigBuf] Buffer
   * @param [*Buffer] Buffer
   * @returns [end] Buffer
   */
  export const signatureScript = (sigBuf: Buffer, pubKeyBuf: Buffer) => {
    const before = addOperand(Buffer.from([]), sigBuf)
    const end = addOperand(before, pubKeyBuf)

    return end
  }

  /**
   * @export get-SignHash
   * @param [*protobuf] string
   * @returns
   */
  export const getSignHash = (protobuf: string) => {
    return Hash.hash256(Buffer.from(protobuf, 'base64'))
  }

  export const jsonInterfaceMethodToString = json => {
    if (isObject(json) && json.name && json.name.includes('(')) {
      return json.name
    }
    return ''
      .concat(json.name, '(')
      .concat(_flattenTypes(false, json.inputs).join(','), ')')
  }

  export const keccak256 = value => {
    if (isHexStrict(value) && /^0x/i.test(value.toString())) {
      value = hexToBytes(value)
    }
    var returnValue = Hash.keccak256(value)
    if (returnValue === KECCAK256_NULL_S) {
      return null
    } else {
      return returnValue
    }
  }

  /**
   * Returns a `Boolean` on whether or not the a `String` starts with '0x'
   * @param {String} str the string input value
   * @return {Boolean} a boolean if it is or is not hex prefixed
   * @throws if the str input is not a string
   */
  export const isHexPrefixed = str => {
    if (typeof str !== 'string') {
      throw new Error(
        '[is-hex-prefixed] value must be type \'string\', is currently type ' +
          typeof str +
          ', while checking isHexPrefixed.'
      )
    }

    return str.slice(0, 2) === '0x'
  }

  /**
   * Removes '0x' from a given `String` is present
   * @param {String} str the string value
   * @return {String|Optional} a string by pass if necessary
   */
  export const stripHexPrefix = str => {
    if (typeof str !== 'string') {
      return str
    }

    return isHexPrefixed(str) ? str.slice(2) : str
  }

  /**
   * Convert hex address to box address format
   * @param {String} prefix: the box address prefix
   * @param {hexAddr} hexAddr: hex address without '0x' prefix
   * @return {String} box address, starting with "b"
   * @throws when prefix is not expected
   */
  export const hex2BoxAddr = (prefix: string, hexAddr: string) => {
    if (prefix !== ('b1' || 'b2' || 'b3')) {
        throw new Error('Incorrect address prefix !')
    }
    const prefixBuf = PREFIXSTR2BYTES[prefix]
    const prefixPKH = Buffer.concat([prefixBuf, Buffer.from(hexAddr, 'hex')])
    return bs58.encode(Buffer.concat([prefixPKH, Verify.getCheckSum(prefixPKH)]))
  }

  /**
   * Convert box address to hex address format
   * @param {boxAddr} boxAddr: address in box format, starting with 'b'
   * @return {String} hex address
   * @throws if convertion fails
   */
  export const box2HexAddr = (boxAddr: string) => {
    try {
      const pubKey_hash = Verify.isAddr(boxAddr)
      if (pubKey_hash) {
        return pubKey_hash.slice(2).toString(OP_CODE_TYPE)
      }
      console.log('dumpPubKeyHashFromAddr Error !')
      throw new Error("dumpPubKeyHashFromAddr Error")
    } catch (err) {
      console.log('dumpPubKeyHashFromAddr Error !')
      throw new Error(err)
    }
  }
}

export default Util
