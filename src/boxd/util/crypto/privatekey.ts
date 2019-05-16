import bitcore from 'bitcore-lib'
import bs58 from 'bs58'
import { hash160, sha256 } from './hash'
import { getECfromPrivKey } from '../../util/crypto/ecpair'
import { getSignHash, signatureScript } from '../../util/util'
import { getCryptoJSON } from '../../util/crypto/keystore'
import UtilRequest from '../request'

const OP_CODE_TYPE = 'hex'
const prefix = {
  P2PKH: '1326',
  P2SH: '132b'
}

/**
 * @class [PrivateKey]
 * @constructs [privateKey]
 */
export class PrivateKey {
  privKey
  constructor(privkey_str) {
    this.privKey = new bitcore.PrivateKey(privkey_str)
    this.privKey.signMsg = sigHash => {
      const eccPrivateKey = privkey_str && getECfromPrivKey(privkey_str)
      return eccPrivateKey.sign(sigHash).sig
    }
    this.privKey.pkh = this.getPubKeyHashByPrivKey()
    this.privKey.toP2PKHAddress = this.getAddrByPrivKey(prefix.P2PKH)
    this.privKey.toP2SHAddress = this.getAddrByPrivKey(prefix.P2SH)
  }

  /**
   * @func get-cryptoJson-with-privateKey&password
   * @param [*pwd] string
   * @returns [cryptoJson]
   */
  getCrypto = (pwd: string) => {
    return getCryptoJSON(this.privKey, pwd)
  }

  /**
   * @export sign-Transaction-by-PrivKey
   * @param [*unsigned_tx] SignedTxByPrivKeyReq
   * @returns [tx]
   */
  signTransactionByPrivKey = async (
    unsigned_tx: UtilRequest.SignedTxByPrivKeyReq
  ) => {
    let { tx, rawMsgs } = unsigned_tx.unsignedTx
    let _privKey = unsigned_tx.privKey
    for (let idx = 0; idx < tx.vin.length; idx++) {
      const sigHashBuf = getSignHash(rawMsgs[idx])
      const eccPrivKey = _privKey && getECfromPrivKey(_privKey)
      const signBuf = eccPrivKey.sign(sigHashBuf).sig
      const scriptSig = signatureScript(
        signBuf,
        this.privKey.toPublicKey().toBuffer()
      )
      tx.vin[idx].script_sig = scriptSig.toString('base64')
    }
    return tx
  }

  getAddrByPrivKey = (prefixHex: string) => {
    const sha256Content = prefixHex + this.privKey.pkh
    const checksum = sha256(
      sha256(Buffer.from(sha256Content, OP_CODE_TYPE))
    ).slice(0, 4)
    const content = sha256Content.concat(checksum.toString(OP_CODE_TYPE))
    return bs58.encode(Buffer.from(content, OP_CODE_TYPE))
  }

  getPubKeyHashByPrivKey = () => {
    return hash160(this.privKey.toPublicKey().toBuffer()).toString(OP_CODE_TYPE)
  }
}
