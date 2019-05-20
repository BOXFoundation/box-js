import tinySecp from 'tiny-secp256k1'
import bs58 from 'bs58'
import Hash from '../util/crypto/hash'

const OP_CODE_TYPE = 'hex'
const getCheckSum = (hex: string | Buffer) => {
  if (hex instanceof Buffer) {
    return Hash.sha256(Hash.sha256(hex)).slice(0, 4)
  } else {
    return Hash.sha256(Hash.sha256(Buffer.from(hex, OP_CODE_TYPE))).slice(0, 4)
  }
}

namespace Verify {
  export const isPrivate = (privKey: string) => {
    if (tinySecp.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
      return privKey
    } else {
      throw new Error('The private key entered is not a valid one !')
    }
  }

  export const isAddr = (addr: string) => {
    if (addr.substring(0, 2) !== ('b1' || 'b2' || 'b3')) {
      throw new Error(`Incorrect address format !`)
    }
    const decoded = bs58.decode(addr)
    if (decoded.length < 4) {
      throw new Error(`Address length = ${decoded.length}: is too short !`)
    }
    const len = decoded.length
    const pubkey_hash = decoded.slice(0, len - 4)
    const checksum = getCheckSum(pubkey_hash)
    if (!checksum.equals(decoded.slice(len - 4))) {
      throw new Error(`Incorrect address format !`)
    }
    return pubkey_hash
  }

  export const isPublic = privKey => {
    console.log('privKey:', privKey)
  }

  export const isPublicHash = pubkey_hash => {
    console.log('pubkey_hash:', pubkey_hash)
  }
}

export default Verify
