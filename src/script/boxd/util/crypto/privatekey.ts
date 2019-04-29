import bitcore from 'bitcore-lib'
const { fromPrivateKey } = require('./ecpair')
import { hash160, sha256 } from './hash'
import bs58 from 'bs58'

const prefix = {
  P2PKH: '1326',
  P2SH: '132b'
}

function getAddress(_this: bitcore.PrivateKey, prefixHex: string) {
  return function() {
    const sha256Content = prefixHex + this.pkh
    const checksum = sha256(sha256(Buffer.from(sha256Content, 'hex'))).slice(
      0,
      4
    )
    const content = sha256Content.concat(checksum.toString('hex'))
    this.P2PKHAddress = bs58.encode(Buffer.from(content, 'hex'))
    return this.P2PKHAddress
  }.bind(_this)
}

/**
 * creat a new accont
 *
 * @param {string} privateKeyStr
 */
export function newPrivateKey(privateKeyStr: string) {
  const newPrivateKey: any = new bitcore.PrivateKey(privateKeyStr)
  newPrivateKey.signMsg = (sigHash: any) => {
    const eccPrivateKey = fromPrivateKey(Buffer.from(privateKeyStr, 'hex'))
    return eccPrivateKey.sign(sigHash).sig
  }
  newPrivateKey.pkh = getPublicAddress(newPrivateKey)
  newPrivateKey.toP2PKHAddress = getAddress(newPrivateKey, prefix.P2PKH)
  newPrivateKey.toP2SHAddress = getAddress(newPrivateKey, prefix.P2SH)

  return newPrivateKey
}

export const getPublicAddress = (privateKey: bitcore.PrivateKey) => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString('hex')
}