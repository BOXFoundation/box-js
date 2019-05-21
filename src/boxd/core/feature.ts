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
   * @export Sign-Transaction-by-Keystore
   * @param [*unsigned_tx] SignedTxByKeysReq
   * @returns [tx] TxResponse.TX
   */
  public async signTransactionByKeystore(
    unsigned_tx: TxRequest.SignedTxByKeysReq
  ) {
    try {
      const acc = new Account()
      const privKey = await acc.dumpPrivKeyFromKeyStore(
        unsigned_tx.keystore,
        unsigned_tx.pwd
      )
      const unsigned_tx_p = {
        privKey,
        unsignedTx: unsigned_tx.unsignedTx
      }
      const privk = new PrivateKey(privKey)
      return privk.signTransactionByPrivKey(unsigned_tx_p)
    } catch (err) {
      console.log('signTransactionByKeystore Error:', err)
    }
  }

  /**
   * @export Sign-Transaction-by-Keystore
   * @param [*unsigned_tx] SignedTxByKeysReq
   * @returns [tx] TxResponse.TX
   */
  /*     public async makeBoxTxByKeystore(
    org_tx: TxRequest.MakeBoxTxByKeysReq,
  ) {
    try {
      const cor = new Core(this._fetch, this.endpoint, this.fetch_type)
      const unsigned_tx = await cor.makeUnsignedTx(org_tx.tx)
    }
  } */
}
