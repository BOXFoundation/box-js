import bitcore from 'bitcore-lib'
import bs58 from 'bs58'
import Hash from './hash'
import Ecpair from './ecpair'
import Util from '../util'
import CryptoJson from './crypto-json'
import UtilInterface from '../interface'

const prefix = {
  P2PKH: '1326',
  P2SH: '132b'
}

/**
 * @class [PrivateKey]
 * @constructs privKey
 */
export default class PrivateKey {
  public privKey

  public constructor(privkey_str) {
    // console.log('privkey_str :', privkey_str)
    if (privkey_str) {
      privkey_str = privkey_str.padStart(64, '0')
    }
    this.privKey = new bitcore.PrivateKey(privkey_str)
    this.privKey.signMsg = sigHash => {
      const eccPrivateKey = privkey_str && Ecpair.getECfromPrivKey(privkey_str)
      return eccPrivateKey.sign(sigHash).sig
    }
    this.privKey.pkh = this.getPubKeyHashByPrivKey()
    this.privKey.toP2PKHAddress = this.getAddrByPrivKey(prefix.P2PKH)
    this.privKey.toP2SHAddress = this.getAddrByPrivKey(prefix.P2SH)
  }

  /**
   * @func Get_CryptoJson_by_PrivateKey_&_Password
   * @param [*pwd]
   * @returns [crypto.json]
   * @memberof PrivateKey   *
   */
  public getCryptoByPrivKey = (pwd: string) => {
    return CryptoJson.getCryptoByPrivKey(this.privKey, pwd)
  }

  /**
   * @export Sign_Transaction_by_PrivKey
   * @param [*unsigned_tx]
   * @branch [next__sendTx_||_sendRawTx]
   * @returns [tx]
   * @memberof PrivateKey   *
   */
  public signTxByPrivKey = async (
    unsigned_tx: UtilInterface.SignedTxByPrivKeyReq
  ) => {
    let { tx, rawMsgs } = unsigned_tx.unsignedTx
    let _privKey = unsigned_tx.privKey
    console.log('test privKey :', _privKey)
    const eccPrivKey = _privKey && Ecpair.getECfromPrivKey(_privKey)

    // vin handler
    for (let idx = 0; idx < tx.vin.length; idx++) {
      let signBuf
      if (rawMsgs[idx] instanceof Buffer) {
        console.log('=> rawMsgs Buffer')
        signBuf = eccPrivKey.sign(rawMsgs[idx]).sig // rawMsgs : raw hash
      } else {
        signBuf = eccPrivKey.sign(Buffer.from(rawMsgs[idx], 'hex')).sig // rawMsgs : raw hash
      }
      console.log('test signed buffer :', signBuf)
      console.log('test signed hex string :', signBuf.toString('hex'))
      const scriptSig = await Util.signatureScript(
        signBuf,
        this.privKey.toPublicKey().toBuffer()
      )
      const scriptsig_bs64 = scriptSig.toString('base64')

      tx.vin[idx].script_sig = scriptsig_bs64
      if (unsigned_tx.protocalTx) {
        unsigned_tx.protocalTx.getVinList()[idx].setScriptSig(scriptsig_bs64)
      }
    }
    if (unsigned_tx.protocalTx) {
      return unsigned_tx.protocalTx.serializeBinary().toString('hex')
    } else {
      return tx
    }
  }

  /**
   * @func get_Address_by_PrivKey
   * @memberof PrivateKey
   */
  public getAddrByPrivKey = (prefixHex: string) => {
    const sha256Content = prefixHex + this.privKey.pkh
    const checksum = Hash.sha256(
      Hash.sha256(Buffer.from(sha256Content, 'hex'))
    ).slice(0, 4)
    const content = sha256Content.concat(checksum.toString('hex'))
    return bs58.encode(Buffer.from(content, 'hex'))
  }

  /**
   * @func get_PubKeyHash_by_PrivKey
   * @memberof PrivateKey
   */
  public getPubKeyHashByPrivKey = () => {
    return Hash.hash160(this.privKey.toPublicKey().toBuffer()).toString('hex')
  }
}
