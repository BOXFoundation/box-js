import tinySecp from 'tiny-secp256k1'
import bs58 from 'bs58'
import Hash from '../util/crypto/hash'

let _typeof2 = obj => {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof2 = function _typeof2(obj) {
      return typeof obj
    }
  } else {
    _typeof2 = function _typeof2(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof2(obj)
}

namespace Verify {
  export const isPrivate = (privKey: string) => {
    if (tinySecp.isPrivate(Buffer.from(privKey, 'hex'))) {
      return privKey
    } else {
      throw new Error('The private key entered is not a valid one !')
    }
  }

  export const getCheckSum = (hex: string | Buffer) => {
    if (hex instanceof Buffer) {
      return Hash.sha256(Hash.sha256(hex)).slice(0, 4)
    } else {
      return Hash.sha256(Hash.sha256(Buffer.from(hex, 'hex'))).slice(0, 4)
    }
  }

  export const isAddr = (addr: string) => {
    if (!['b1', 'b2', 'b3', 'b5'].includes(addr.substring(0, 2))) {
      throw new Error('Incorrect address format !')
    }
    const decoded = bs58.decode(addr)
    if (decoded.length < 4) {
      throw new Error(`Address length = ${decoded.length}: is too short !`)
    }
    const len = decoded.length
    const pubkey_hash = decoded.slice(0, len - 4)
    const checksum = getCheckSum(pubkey_hash)
    if (!checksum.equals(decoded.slice(len - 4))) {
      throw new Error('Incorrect address format !')
    }
    return pubkey_hash
  }

  export const isPublic = privKey => {
    console.log('privKey:', privKey)
  }

  export const isPublicHash = pubkey_hash => {
    console.log('pubkey_hash:', pubkey_hash)
  }

  export let _typeof = obj => {
    if (
      typeof Symbol === 'function' &&
      _typeof2(Symbol.iterator) === 'symbol'
    ) {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj)
      }
    } else {
      _typeof = function _typeof(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : _typeof2(obj)
      }
    }

    return _typeof(obj)
  }
}

export default Verify
