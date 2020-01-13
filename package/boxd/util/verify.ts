import secp from 'secp256k1'
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
  /**
   * @func get_check_sum
   * @param [*hex]
   * @returns [check_sum]
   */
  export const getCheckSum = (hex: string | Buffer) => {
    if (hex instanceof Buffer) {
      return Hash.sha256(Hash.sha256(hex)).slice(0, 4)
    } else {
      return Hash.sha256(Hash.sha256(Buffer.from(hex, 'hex'))).slice(0, 4)
    }
  }

  /**
   * @func check_is_private_key
   * @param [*privKey]
   * @returns [boolean]
   */
  export const isPrivate = (privKey: string) => {
    if (secp.privateKeyVerify(Buffer.from(privKey, 'hex'))) {
      return privKey
    } else {
      return false
    }
  }

  /**
   * @func check_is_BOX_address
   * @param [*addr]
   * @returns [pubkey_hash]
   */
  export const isBoxAddr = (addr: string) => {
    if (!['b1', 'b2', 'b3', 'b5'].includes(addr.substring(0, 2))) {
      throw new Error('[isBoxAddr] Incorrect address format !')
    }
    const decoded = bs58.decode(addr)
    if (decoded.length < 4) {
      throw new Error(
        `[isBoxAddr] Address length = ${decoded.length}: is too short !`
      )
    }
    const len = decoded.length
    const pubkey_hash = decoded.slice(0, len - 4)
    const checksum = getCheckSum(pubkey_hash)
    if (!checksum.equals(decoded.slice(len - 4))) {
      throw new Error('[isBoxAddr] Incorrect address format !')
    }
    return pubkey_hash
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
