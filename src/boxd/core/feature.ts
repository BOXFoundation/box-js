import { Fetch } from '../util/fetch'
import TxRequest from './tx/request'
import SplitRequest from './split/request'
import TokenRequest from './token/request'
import ContractRequest from './contract/request'
import Account from '../account/account'
import PrivateKey from '../util/crypto/privatekey'
import Core from '../core/api'
// import UtilInterface from '../util/interface'

/**
 * @class [Feature]
 * @extends Fetch
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export default class Feature extends Fetch {
  public constructor(_fetch: any, endpoint: string, fetch_type) {
    super(_fetch, endpoint, fetch_type)
  }

  /**
   * @export Sign-Transaction-by-CryptoJson
   * @param [*unsigned_tx] SignedTxByCryptoReq
   * @returns [tx] TxResponse.TX
   */
  public async signTxByCrypto(unsigned_tx: TxRequest.SignedTxByCryptoReq) {
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
    return privk.signTxByPrivKey(unsigned_tx_p)
  }

  /**
   * @export Make-Box-Transaction-by-Crypto
   * @param [*org_tx] MakeBoxTxByCryptoReq
   * @returns [Promise] { hash: string }
   */
  public async makeBoxTxByCrypto(
    org_tx: TxRequest.MakeBoxTxByCryptoReq
  ): Promise<{ hash: string }> {
    const cor = new Core(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await cor.makeUnsignedTx(org_tx.tx)
    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await cor.sendTx(signed_tx)
    return tx_result
  }

  /**
   * @export Make-Split-Transaction-by-Crypto
   * @param [*org_tx] MakeSplitTxByCryptoReq
   * @returns [Promise] { hash: string }
   */
  public async makeSplitTxByCrypto(
    org_tx: SplitRequest.MakeSplitTxByCryptoReq
  ): Promise<{ splitAddr: string; hash: string }> {
    const cor = new Core(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await cor.makeUnsignedSplitAddrTx(org_tx.tx)
    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await cor.sendTx(signed_tx)
    return Object.assign(tx_result, { splitAddr: unsigned_tx.splitAddr })
  }

  /**
   * @export Issue-Token-by-Crypto
   * @param [*org_tx] IssueTokenByCryptoReq
   * @returns [Promise] { hash: string }
   */
  public async issueTokenByCrypto(
    org_tx: TokenRequest.IssueTokenByCryptoReq
  ): Promise<{ hash: string }> {
    const cor = new Core(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await cor.makeUnsignedTokenIssueTx(org_tx.tx)
    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await cor.sendTx(signed_tx)
    return tx_result
  }

  /**
   * @export Make-Token-Transaction-by-Crypto
   * @param [*org_tx] MakeTokenTxByCryptoReq
   * @returns [Promise] { hash: string }
   */
  public async makeTokenTxByCrypto(
    org_tx: TokenRequest.MakeTokenTxByCryptoReq
  ): Promise<{ hash: string }> {
    const cor = new Core(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await cor.makeUnsignedTokenTx(org_tx.tx)
    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await cor.sendTx(signed_tx)
    return tx_result
  }

  /**
   * @export Make-Contract-Transaction-by-Crypto
   * @param [*org_tx] ContractTxByCryptoReq
   * @returns [Promise] { hash: string }
   */
  public async makeContractTxByCrypto(
    org_tx: ContractRequest.ContractTxByCryptoReq
  ): Promise<{ hash: string }> {
    const cor = new Core(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await cor.makeUnsignedContractTx(org_tx.tx)
    
    // contract method call
    if (org_tx.tx.from.length == 0) {
      return {hash: unsigned_tx.callResult};
    }

    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await cor.sendTx(signed_tx)
    return tx_result
  }  
}
