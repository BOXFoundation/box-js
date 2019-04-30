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
 * @export new-PrivateKey
 * @param [privateKeyStr] string
 */
export const newPrivateKey = (privateKeyStr?: string) => {
  const new_privateKey: any = new bitcore.PrivateKey(privateKeyStr)
  new_privateKey.signMsg = (sigHash: any) => {
    const eccPrivateKey =
      privateKeyStr && fromPrivateKey(Buffer.from(privateKeyStr, 'hex'))
    return eccPrivateKey.sign(sigHash).sig
  }
  new_privateKey.pkh = getPublicAddress(new_privateKey)
  new_privateKey.toP2PKHAddress = getAddress(new_privateKey, prefix.P2PKH)
  new_privateKey.toP2SHAddress = getAddress(new_privateKey, prefix.P2SH)

  return new_privateKey
}

export const getPublicAddress = (privateKey: bitcore.PrivateKey) => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString('hex')
}
