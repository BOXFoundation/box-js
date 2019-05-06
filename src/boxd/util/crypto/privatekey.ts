import bitcore from 'bitcore-lib'
import { fromPrivateKey } from './ecpair'
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
 * @param [privateKey_str] string
 */
export const newPrivateKey = (privateKey_str?: string) => {
  const privateKey: any = new bitcore.PrivateKey(privateKey_str)
  privateKey.signMsg = (sigHash: any) => {
    const eccPrivateKey =
      privateKey_str && fromPrivateKey(Buffer.from(privateKey_str, 'hex'))
    return eccPrivateKey.sign(sigHash).sig
  }
  privateKey.pkh = getPublicAddress(privateKey)
  privateKey.toP2PKHAddress = getAddress(privateKey, prefix.P2PKH)
  privateKey.toP2SHAddress = getAddress(privateKey, prefix.P2SH)

  return privateKey
}

export const getPublicAddress = (privateKey: bitcore.PrivateKey) => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString('hex')
}
