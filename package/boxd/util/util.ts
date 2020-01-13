import bs58 from 'bs58'
import Opcode from './var'
import Verify from './verify'
import Hash from './crypto/hash'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import AbiUtil from '../core/contract/abi/util'
import SplitUtil from '../core/split/util'
import TokenUtil from '../core/token/util'
import TxUtil from '../core/tx/util'

const {
  OP_0,
  OP_PUSH_DATA_1,
  OP_PUSH_DATA_2,
  OP_PUSH_DATA_4,
  OP_DUP,
  OP_HASH_160,
  OP_EQUAL_VERIFY,
  OP_CHECK_SIG
} = Opcode

const PREFIXSTR2BYTES = {
  b1: Buffer.from([0x13, 0x26]),
  b2: Buffer.from([0x13, 0x28]),
  b3: Buffer.from([0x13, 0x2a]),
  b5: Buffer.from([0x13, 0x30])
}

/* keccak = BEGIN = */
const KECCAK256_NULL_S =
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
const isHexStrict = (hex) => {
  return (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex)
}
const hexToBytes = (hex) => {
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

const _flattenTypes = (includeTuple, puts) => {
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

namespace CommonUtil {
  export const to16StrFromNumber = (num: number) => (num & 255).toString(16)

  export const getBufFromNumber = (num: number) => num & 255

  /**
   * @func Put_Uint16
   * @param [*bytes]
   * @param [*uint16]
   * @returns [bytes]
   */
  export const putUint16 = (bytes, uint16: number) => {
    if (bytes.length < 2) {
      return new Error('The length of the bytes should more than 2 !')
    }
    bytes[0] = getBufFromNumber(uint16)
    bytes[1] = uint16 >> 8

    return bytes
  }

  export class Opcoder {
    public OP_0 = OP_0
    public OP_PUSH_DATA_1 = OP_PUSH_DATA_1
    public OP_PUSH_DATA_2 = OP_PUSH_DATA_2
    public OP_PUSH_DATA_4 = OP_PUSH_DATA_4
    public OP_DUP = OP_DUP
    public OP_HASH_160 = OP_HASH_160
    public OP_EQUAL_VERIFY = OP_EQUAL_VERIFY
    public OP_CHECK_SIG = OP_CHECK_SIG
    public opcode

    public constructor(org_code) {
      this.opcode = Buffer.from(org_code, 'hex')
    }

    public reset(org_code) {
      this.opcode = Buffer.from(org_code, 'hex')
      return this
    }

    public getCode() {
      return this.opcode
    }

    /**
     * @export add-opcode
     * @param [*and_buf]
     * @param [?isBuf] boolean
     * @returns [opcode] Buffer
     */
    public add(and_buf) {
      if (!(and_buf instanceof Buffer)) {
        if (and_buf instanceof Number) {
          console.log('=> instanceof Number')
          and_buf = Buffer.from(and_buf.toString())
        } else {
          and_buf = Buffer.from(and_buf.toString(), 'hex')
        }
      }
      const and_len = and_buf.length
      let and_len_str = to16StrFromNumber(and_len)
      and_len_str = and_len_str.padStart(2, '0')
      // console.log('[opcode add] and_len_str :', and_len_str)
      if (and_len < OP_PUSH_DATA_1) {
        // console.log('=> OP_PUSH_DATA_1')
        // console.log('[opcode add] this.opcode :', this.opcode)
        // console.log('[opcode add] and_len_str :', and_len_str)
        this.opcode = Buffer.concat([
          this.opcode,
          Buffer.from(and_len_str, 'hex')
        ])
      } else if (and_len <= 0xff) {
        this.opcode = Buffer.concat([
          this.opcode,
          Buffer.from(to16StrFromNumber(OP_PUSH_DATA_1), 'hex'),
          Buffer.from(and_len_str, 'hex')
        ])
      } else if (and_len <= 0xffff) {
        let buf = Buffer.alloc(2)
        buf = putUint16(buf, and_len)
        this.opcode = Buffer.concat([
          this.opcode,
          Buffer.from(to16StrFromNumber(OP_PUSH_DATA_2), 'hex'),
          buf
        ])
      } else {
        let buf = Buffer.alloc(4)
        buf = putUint16(buf, and_len)
        this.opcode = Buffer.concat([
          this.opcode,
          Buffer.from(to16StrFromNumber(OP_PUSH_DATA_4), 'hex'),
          buf
        ])
      }

      // concat the and_buf
      this.opcode = Buffer.concat([this.opcode, and_buf])

      return this
    }
  }

  /**
   * @func Put-Uint32
   * TODO: it not support int32 now
   * @param [*bytes]
   * @param [*uint32]
   * @returns [bytes]
   */
  export const putUint32 = (bytes, uint32: number) => {
    if (bytes.length < 4) {
      return new Error('The length of the bytes should more than 4 !')
    }
    bytes[0] = getBufFromNumber(uint32)
    bytes[1] = uint32 >> 8
    bytes[2] = uint32 >> 16
    bytes[3] = uint32 >> 24

    return bytes
  }

  /**
   * @func Signature-Script
   * @param [*sigBuf]
   * @param [*Buffer]
   * @returns [end]
   */
  export const signatureScript = (
    sigBuf: Buffer,
    pubKeyBuf: Buffer
  ): Buffer => {
    const op = new Opcoder([])
    return op
      .add(sigBuf)
      .add(pubKeyBuf)
      .getCode()
  }

  /**
   * @func Get-SignHash
   * @param [*protobuf]
   * @returns
   */
  export const getSignHash = (protobuf: string | Buffer) => {
    if (typeof protobuf === 'string') {
      return Hash.hash256(Buffer.from(protobuf, 'base64'))
    } else {
      return Hash.hash256(protobuf)
    }
  }

  export const jsonInterfaceMethodToString = (json) => {
    if (isObject(json) && json.name && json.name.includes('(')) {
      return json.name
    }
    return ''
      .concat(json.name, '(')
      .concat(_flattenTypes(false, json.inputs).join(','), ')')
  }

  export const keccak256 = (value) => {
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
   * @func # Returns a `Boolean` on whether or not the a `String` starts with '0x'
   * @param [*str] str the string input value
   * @return [boolean] a boolean if it is or is not hex prefixed
   * @throws if the str input is not a string
   */
  export const isHexPrefixed = (str) => {
    if (typeof str !== 'string') {
      throw new Error(
        "[is-hex-prefixed] value must be type 'string', is currently type " +
          typeof str +
          ', while checking isHexPrefixed.'
      )
    }

    return str.slice(0, 2) === '0x'
  }

  /**
   * @func # Removes '0x' from a given `String` is present
   * @param [*str] str the string value
   * @return [string|optional] a string by pass if necessary
   */
  export const stripHexPrefix = (str) => {
    if (typeof str !== 'string') {
      return str
    }

    return isHexPrefixed(str) ? str.slice(2) : str
  }

  /**
   * @func Convert_hex_address_to_box_address_format
   * @param [*prefix] string # the box address prefix
   * @param [*hexAddr] string # hex address without '0x' prefix
   * @return [string] box address, starting with "b"
   * @throws when prefix is not expected
   */
  export const hex2BoxAddr = (prefix: string, hexAddr: string) => {
    if (!['b1', 'b2', 'b3', 'b5'].includes(prefix)) {
      throw new Error('Incorrect address prefix !')
    }
    const prefixBuf = PREFIXSTR2BYTES[prefix]
    const prefixPKH = Buffer.concat([prefixBuf, Buffer.from(hexAddr, 'hex')])

    return bs58.encode(
      Buffer.concat([prefixPKH, Verify.getCheckSum(prefixPKH)])
    )
  }

  /**
   * @func Convert_box_address_to_hex_address_format
   * @param [*box_addr] string # address in box format, starting with 'b'
   * @return [string] hex address
   * @throws if convertion fails
   */
  export const box2HexAddr = (box_addr: string) => {
    const pubKey_hash = Verify.isBoxAddr(box_addr)
    if (pubKey_hash) {
      return pubKey_hash.slice(2).toString('hex')
    } else {
      throw new Error('dumpPubKeyHashFromAddr Error')
    }
  }
}

export default Object.assign(CommonUtil, AbiUtil, SplitUtil, TokenUtil, TxUtil)
