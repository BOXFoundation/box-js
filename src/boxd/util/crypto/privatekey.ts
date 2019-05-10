import bitcore from 'bitcore-lib'
import bs58 from 'bs58'
import { hash160, sha256 } from './hash'
import { fromPrivateKey } from '../../util/crypto/ecpair'
import { getSignHash, signatureScript } from '../../util/util'
import Request from '../request'

const OP_CODE_TYPE = 'hex'
const prefix = {
  P2PKH: '1326',
  P2SH: '132b'
}

const getAddress = (_this: bitcore.PrivateKey, prefixHex: string) => {
  return function() {
    const sha256Content = prefixHex + this.pkh
    const checksum = sha256(
      sha256(Buffer.from(sha256Content, OP_CODE_TYPE))
    ).slice(0, 4)
    const content = sha256Content.concat(checksum.toString(OP_CODE_TYPE))
    this.P2PKHAddress = bs58.encode(Buffer.from(content, OP_CODE_TYPE))
    return this.P2PKHAddress
  }.bind(_this)
}

const getPublicAddress = (privateKey: bitcore.PrivateKey) => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString(OP_CODE_TYPE)
}

/**
 * @class [PrivateKey]
 * @constructs [privateKey]
 */
export class PrivateKey {
  privKey
  constructor(privateKey_str) {
    this.privKey = new bitcore.PrivateKey(privateKey_str)
    this.privKey.signMsg = sigHash => {
      const eccPrivateKey =
        privateKey_str &&
        fromPrivateKey(Buffer.from(privateKey_str, OP_CODE_TYPE))
      return eccPrivateKey.sign(sigHash).sig
    }
    this.privKey.pkh = getPublicAddress(this.privKey)
    this.privKey.toP2PKHAddress = getAddress(this.privKey, prefix.P2PKH)
    this.privKey.toP2SHAddress = getAddress(this.privKey, prefix.P2SH)
  }

  /**
   * @export sign-Transaction-by-PrivKey
   * @param [*unsigned_tx] SignedTxByPrivKeyReq
   * @returns [tx]
   */
  signTransactionByPrivKey = async (
    unsigned_tx: Request.SignedTxByPrivKeyReq
  ) => {
    let { tx, rawMsgs } = unsigned_tx.unsignedTx
    let _privKey = unsigned_tx.privKey
    for (let idx = 0; idx < tx.vin.length; idx++) {
      const sigHashBuf = getSignHash(rawMsgs[idx])
      const eccPrivKey =
        _privKey && fromPrivateKey(Buffer.from(_privKey, OP_CODE_TYPE))
      const signBuf = eccPrivKey.sign(sigHashBuf).sig
      const scriptSig = signatureScript(
        signBuf,
        this.privKey.toPublicKey().toBuffer()
      )
      tx.vin[idx].script_sig = scriptSig.toString('base64')
    }
    return tx
  }
}
