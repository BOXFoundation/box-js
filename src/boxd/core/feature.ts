import { Fetch } from '../util/fetch'
// import CommonUtil from '../util/util'
import TxRequest from './tx/request'
// import TxResponse from './tx/response'
import Account from '../account/account'
import PrivateKey from '../util/crypto/privatekey'
import Core from '../core/api'

/**
 * @class [Feature]
 * @extends Fetch
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export default class Feature extends Fetch {
  constructor(_fetch: any, endpoint: string, fetch_type) {
    super(_fetch, endpoint, fetch_type)
  }

  /**
   * @export Sign-Transaction-by-CryptoJson
   * @param [*unsigned_tx] SignedTxByKeysReq
   * @returns [tx] TxResponse.TX
   */
  public async signTransactionByCrypto(
    unsigned_tx: TxRequest.SignedTxByKeysReq
  ) {
    const acc = new Account()
    const privKey = await acc.dumpPrivKeyFromCrypto(
      unsigned_tx.crypto,
      unsigned_tx.pwd
    )
    const unsigned_tx_p = {
      privKey,
      unsignedTx: unsigned_tx.unsignedTx
    }
    const privk = new PrivateKey(privKey)
    return privk.signTransactionByPrivKey(unsigned_tx_p)
  }

  /**
   * @export Sign-Transaction-by-Crypto
   * @param [*unsigned_tx] SignedTxByKeysReq
   * @returns [tx] TxResponse.TX
   */
  public async makeBoxTxByCrypto(org_tx: TxRequest.MakeBoxTxByKeysReq) {
    const cor = new Core(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await cor.makeUnsignedTx(org_tx.tx)
    const signed_tx = await this.signTransactionByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await cor.sendTransaction(signed_tx)
    return tx_result
  }
}
