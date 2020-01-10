import BN from 'bn.js'
import CommonUtil from '../../../util/util'
import isObject from 'lodash/isObject'

// Is a type an array?
const abiIsArray = type => {
  return type.lastIndexOf(']') === type.length - 1
}

// Parse N in type[<N>] where "type" can itself be an array type.
const parseTypeArray = type => {
  var tmp = type.match(/(.*)\[(.*?)\]$/)
  if (tmp) {
    return tmp[2] === '' ? 'dynamic' : parseInt(tmp[2], 10)
  }
  return null
}

const parseNumber = arg => {
  var type = typeof arg
  if (type === 'string') {
    if (CommonUtil.isHexPrefixed(arg)) {
      return new BN(CommonUtil.stripHexPrefix(arg), 16)
    } else {
      return new BN(arg, 10)
    }
  } else if (type === 'number') {
    return new BN(arg)
  } else if (arg.toArray) {
    // assume this is a BN for the moment, replace with BN.isBN soon
    return arg
  } else {
    throw new Error('Argument is not a number')
  }
}

const zeros = bytes => {
  return Buffer.allocUnsafe(bytes).fill(0)
}

// Parse N from type<N>
const parseTypeN = type => {
  const typesize = /^\D+(\d+).*$/.exec(type)
  return typesize ? parseInt(typesize[1], 10) : null
}

const setLengthLeft = (msg, length, right) => {
  if (right === void 0) {
    right = false
  }
  var buf = exports.zeros(length)
  msg = exports.toBuffer(msg)
  if (right) {
    if (msg.length < length) {
      msg.copy(buf)
      return buf
    }
    return msg.slice(0, length)
  } else {
    if (msg.length < length) {
      msg.copy(buf, length - msg.length)
      return buf
    }
    return msg.slice(-length)
  }
}

// Parse N,M from type<N>x<M>
const parseTypeNxM = type => {
  var tmp = /^\D+(\d+)x(\d+)$/.exec(type)
  if (tmp) {
    return [parseInt(tmp[1], 10), parseInt(tmp[2], 10)]
  } else {
    return tmp
  }
}

// Is a type dynamic?
const isDynamic = type => {
  // FIXME: handle all types? I don't think anything is missing now
  return (
    type === 'string' || type === 'bytes' || parseTypeArray(type) === 'dynamic'
  )
}

// Encodes a single item (can be dynamic array)
// @returns: Buffer
const encodeSingle = (type, arg) => {
  var size, num, ret, i

  if (type === 'address') {
    return encodeSingle('uint160', parseNumber(arg))
  } else if (type === 'bool') {
    return encodeSingle('uint8', arg ? 1 : 0)
  } else if (type === 'string') {
    return encodeSingle('bytes', Buffer.from(arg, 'utf8'))
  } else if (abiIsArray(type)) {
    // this part handles fixed-length ([2]) and variable length ([]) arrays
    // NOTE: we catch here all calls to arrays, that simplifies the rest
    if (typeof arg.length === 'undefined') {
      throw new Error('Not an array?')
    }
    size = parseTypeArray(type)
    if (size !== 'dynamic' && size !== 0 && arg.length > size) {
      throw new Error('Elements exceed array size: ' + size)
    }
    ret = []
    console.log('type_1:', type)
    type = type.slice(0, type.lastIndexOf('['))
    if (typeof arg === 'string') {
      arg = JSON.parse(arg)
    }
    for (i in arg) {
      ret.push(encodeSingle(type, arg[i]))
    }
    if (size === 'dynamic') {
      var length = encodeSingle('uint256', arg.length)
      ret.unshift(length)
    }
    return Buffer.concat(ret)
  } else if (type === 'bytes') {
    arg = Buffer.from(arg)

    ret = Buffer.concat([encodeSingle('uint256', arg.length), arg])

    if (arg.length % 32 !== 0) {
      ret = Buffer.concat([ret, zeros(32 - (arg.length % 32))])
    }

    return ret
  } else if (type.startsWith('bytes')) {
    size = parseTypeN(type)
    if (size < 1 || size > 32) {
      throw new Error('Invalid bytes<N> width: ' + size)
    }

    return setLengthLeft(arg, 32, true)
  } else if (type.startsWith('uint')) {
    size = parseTypeN(type)
    if (size % 8 || size < 8 || size > 256) {
      throw new Error('Invalid uint<N> width: ' + size)
    }

    num = parseNumber(arg)
    if (num.bitLength() > size) {
      throw new Error(
        'Supplied uint exceeds width: ' + size + ' vs ' + num.bitLength()
      )
    }

    if (num < 0) {
      throw new Error('Supplied uint is negative')
    }

    return num.toArrayLike(Buffer, 'be', 32)
  } else if (type.startsWith('int')) {
    size = parseTypeN(type)
    if (size % 8 || size < 8 || size > 256) {
      throw new Error('Invalid int<N> width: ' + size)
    }

    num = parseNumber(arg)
    if (num.bitLength() > size) {
      throw new Error(
        'Supplied int exceeds width: ' + size + ' vs ' + num.bitLength()
      )
    }

    return num.toTwos(256).toArrayLike(Buffer, 'be', 32)
  } else if (type.startsWith('ufixed')) {
    size = parseTypeNxM(type)

    num = parseNumber(arg)

    if (num < 0) {
      throw new Error('Supplied ufixed is negative')
    }

    return encodeSingle('uint256', num.mul(new BN(2).pow(new BN(size[1]))))
  } else if (type.startsWith('fixed')) {
    size = parseTypeNxM(type)

    return encodeSingle(
      'int256',
      parseNumber(arg).mul(new BN(2).pow(new BN(size[1])))
    )
  }

  throw new Error('Unsupported or invalid type: ' + type)
}

// Convert from short to canonical names
// FIXME: optimise or make this nicer?
const elementaryName = name => {
  if (name.startsWith('int[')) {
    return 'int256' + name.slice(3)
  } else if (name === 'int') {
    return 'int256'
  } else if (name.startsWith('uint[')) {
    return 'uint256' + name.slice(4)
  } else if (name === 'uint') {
    return 'uint256'
  } else if (name.startsWith('fixed[')) {
    return 'fixed128x128' + name.slice(5)
  } else if (name === 'fixed') {
    return 'fixed128x128'
  } else if (name.startsWith('ufixed[')) {
    return 'ufixed128x128' + name.slice(6)
  } else if (name === 'ufixed') {
    return 'ufixed128x128'
  }
  return name
}

// Parse the given type
// @returns: {} containing the type itself, memory usage and (including size and subArray if applicable)
const parseType = type => {
  var size
  var ret
  if (abiIsArray(type)) {
    size = parseTypeArray(type)
    var subArray = type.slice(0, type.lastIndexOf('['))
    subArray = parseType(subArray)
    ret = {
      isArray: true,
      name: type,
      size: size,
      memoryUsage: size === 'dynamic' ? 32 : subArray.memoryUsage * size,
      subArray: subArray
    }
    return ret
  } else {
    var rawType
    switch (type) {
    case 'address':
      rawType = 'uint160'
      break
    case 'bool':
      rawType = 'uint8'
      break
    case 'string':
      rawType = 'bytes'
      break
    }
    ret = {
      rawType: rawType,
      name: type,
      memoryUsage: 32
    }

    if (
      (type.startsWith('bytes') && type !== 'bytes') ||
      type.startsWith('uint') ||
      type.startsWith('int')
    ) {
      ret.size = parseTypeN(type)
    } else if (type.startsWith('ufixed') || type.startsWith('fixed')) {
      ret.size = parseTypeNxM(type)
    }

    if (
      type.startsWith('bytes') &&
      type !== 'bytes' &&
      (ret.size < 1 || ret.size > 32)
    ) {
      throw new Error('Invalid bytes<N> width: ' + ret.size)
    }
    if (
      (type.startsWith('uint') || type.startsWith('int')) &&
      (ret.size % 8 || ret.size < 8 || ret.size > 256)
    ) {
      throw new Error('Invalid int/uint<N> width: ' + ret.size)
    }
    return ret
  }
}

// Decodes a single item (can be dynamic array)
// @returns: array
// FIXME: this method will need a lot of attention at checking limits and validation
function decodeSingle(parsedType, data, offset) {
  if (typeof parsedType === 'string') {
    parsedType = parseType(parsedType)
  }
  var size, num, ret, i

  if (parsedType.name === 'address') {
    return decodeSingle(parsedType.rawType, data, offset)
      .toArrayLike(Buffer, 'be', 20)
      .toString('hex')
  } else if (parsedType.name === 'bool') {
    return (
      decodeSingle(parsedType.rawType, data, offset).toString() ===
      new BN(1).toString()
    )
  } else if (parsedType.name === 'string') {
    var bytes = decodeSingle(parsedType.rawType, data, offset)
    return Buffer.from(bytes, 'utf8').toString()
  } else if (parsedType.isArray) {
    // this part handles fixed-length arrays ([2]) and variable length ([]) arrays
    // NOTE: we catch here all calls to arrays, that simplifies the rest
    ret = []
    size = parsedType.size

    if (parsedType.size === 'dynamic') {
      offset = decodeSingle('uint256', data, offset).toNumber()
      size = decodeSingle('uint256', data, offset).toNumber()
      offset = offset + 32
    }
    for (i = 0; i < size; i++) {
      var decoded = decodeSingle(parsedType.subArray, data, offset)
      ret.push(decoded)
      offset += parsedType.subArray.memoryUsage
    }
    return ret
  } else if (parsedType.name === 'bytes') {
    offset = decodeSingle('uint256', data, offset).toNumber()
    size = decodeSingle('uint256', data, offset).toNumber()
    return data.slice(offset + 32, offset + 32 + size)
  } else if (parsedType.name.startsWith('bytes')) {
    return data.slice(offset, offset + parsedType.size)
  } else if (parsedType.name.startsWith('uint')) {
    num = new BN(data.slice(offset, offset + 32), 16, 'be')
    if (num.bitLength() > parsedType.size) {
      throw new Error(
        'Decoded int exceeds width: ' +
          parsedType.size +
          ' vs ' +
          num.bitLength()
      )
    }
    return num
  } else if (parsedType.name.startsWith('int')) {
    num = new BN(data.slice(offset, offset + 32), 16, 'be').fromTwos(256)
    if (num.bitLength() > parsedType.size) {
      throw new Error(
        'Decoded uint exceeds width: ' +
          parsedType.size +
          ' vs ' +
          num.bitLength()
      )
    }

    return num
  } else if (parsedType.name.startsWith('ufixed')) {
    size = new BN(2).pow(new BN(parsedType.size[1]))
    num = decodeSingle('uint256', data, offset)
    if (!num.mod(size).isZero()) {
      throw new Error('Decimals not supported yet')
    }
    return num.div(size)
  } else if (parsedType.name.startsWith('fixed')) {
    size = new BN(2).pow(new BN(parsedType.size[1]))
    num = decodeSingle('int256', data, offset)
    if (!num.mod(size).isZero()) {
      throw new Error('Decimals not supported yet')
    }
    return num.div(size)
  }
  throw new Error('Unsupported or invalid type: ' + parsedType.name)
}

namespace Util {
  export const rawEncode = (types, values) => {
    var output: any = []
    var data: any = []
    var headLength = 0
    types.forEach(function(type) {
      if (abiIsArray(type)) {
        var size: any = parseTypeArray(type)
        if (size !== 'dynamic') {
          if (size) {
            headLength += 32 * size
          }
        } else {
          headLength += 32
        }
      } else {
        headLength += 32
      }
    })

    for (var i = 0; i < types.length; i++) {
      var type = elementaryName(types[i])
      if (type === 'address') {
        values[i] = `0x${values[i]}`
      }
      var value = values[i]
      var cur = encodeSingle(type, value)
      // Use the head/tail method for storing dynamic data
      if (isDynamic(type)) {
        output.push(encodeSingle('uint256', headLength))
        data.push(cur)
        headLength += cur.length
      } else {
        output.push(cur)
      }
    }

    return Buffer.concat(output.concat(data))
  }

  export const rawDecode = function(types, data) {
    var ret: any = []
    data = Buffer.from(data)
    var offset = 0
    for (var i = 0; i < types.length; i++) {
      var type
      if (isObject(types[i])) {
        type = elementaryName(types[i].name)
      } else {
        type = elementaryName(types[i])
      }
      var parsed = parseType(type)
      var decoded = decodeSingle(parsed, data, offset)
      if (parsed.name.startsWith('uint') || parsed.name.startsWith('int')) {
        decoded = parseInt(decoded.toString(10), 10)
      }
      offset += parsed.memoryUsage
      ret.push(decoded)
    }
    return ret
  }
}

export default Util
