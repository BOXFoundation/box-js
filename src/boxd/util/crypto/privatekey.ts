import bitcore from 'bitcore-lib'
import bs58 from 'bs58'
import Hash from './hash'
import Ecpair from './ecpair'
import CommonUtil from '../util'
import CryptoJson from './crypto-json'
import UtilInterface from '../interface'

const OPCODE_TYPE = 'hex'
const prefix = {
  P2PKH: '1326',
  P2SH: '132b'
}

/**
 * @class [PrivateKey]
 * @constructs [privKey]
 */
export default class PrivateKey {
  public privKey
  public constructor(privkey_str) {
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
   * @func get-CryptoJson-by-PrivateKey&Password
   * @param [*pwd] string
   * @returns [cryptoJSON]
   */
  public getCryptoByPrivKey = (pwd: string) => {
    return CryptoJson.getCryptoByPrivKey(this.privKey, pwd)
  }

  /**
   * @export sign-Transaction-by-PrivKey
   * @param [*unsigned_tx] SignedTxByPrivKeyReq
   * @returns [tx]
   */
  public signTxByPrivKey = async (
    unsigned_tx: UtilInterface.SignedTxByPrivKeyReq
  ) => {
    let { tx, rawMsgs } = unsigned_tx.unsignedTx
    let _privKey = unsigned_tx.privKey
    // vin handler
    for (let idx = 0; idx < tx.vin.length; idx++) {
      const sigHashBuf = CommonUtil.getSignHash(rawMsgs[idx])
      const eccPrivKey = _privKey && Ecpair.getECfromPrivKey(_privKey)
      const signBuf = eccPrivKey.sign(sigHashBuf).sig
      const scriptSig = await CommonUtil.signatureScript(
        signBuf,
        this.privKey.toPublicKey().toBuffer()
      )
      tx.vin[idx].script_sig = scriptSig.toString('base64')
    }
    return tx
  }

  /**
   * @export sign-Transaction-by-PrivKey
   * @param [*unsigned_tx] SignedTxByPrivKeyReq
   * @returns [tx]
   */
  /*   public signTxByPrivKeyOfProto = async unsigned_tx => {
    let { tx, rawMsgs } = unsigned_tx.unsignedTx
    let _privKey = unsigned_tx.privKey
    // vin handler
    const vin_list = tx.getVinList()
    for (let idx = 0; idx < vin_list.length; idx++) {
      const sigHashBuf = CommonUtil.getSignHash(rawMsgs[idx])
      const eccPrivKey = _privKey && Ecpair.getECfromPrivKey(_privKey)
      const signBuf = eccPrivKey.sign(sigHashBuf).sig
      const scriptSig = await CommonUtil.signatureScript(
        signBuf,
        this.privKey.toPublicKey().toBuffer()
      )
      vin_list[idx].setScriptSig(scriptSig.toString('base64'))
    }
    tx.setVinList(vin_list)
    console.log('tx :', tx)
    const script = tx.getVinList()[0].getScriptSig()
    console.log('script :', script)
    return tx
  } */

  public getAddrByPrivKey = (prefixHex: string) => {
    const sha256Content = prefixHex + this.privKey.pkh
    const checksum = Hash.sha256(
      Hash.sha256(Buffer.from(sha256Content, OPCODE_TYPE))
    ).slice(0, 4)
    const content = sha256Content.concat(checksum.toString(OPCODE_TYPE))
    return bs58.encode(Buffer.from(content, OPCODE_TYPE))
  }

  public getPubKeyHashByPrivKey = () => {
    return Hash.hash160(this.privKey.toPublicKey().toBuffer()).toString(
      OPCODE_TYPE
    )
  }
}
