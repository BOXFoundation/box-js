import BN from 'bn.js'
import { Fetch } from '../util/fetch'
import TxRequest from './tx/request'
import SplitRequest from './split/request'
import TokenRequest from './token/request'
import ContractRequest from './contract/request'
import Account from '../account/account'
import PrivateKey from '../util/crypto/privatekey'
import Api from '../core/api'
import Util from '../util/util'

/**
 * @class [Feature]
 * @extends Fetch
 * @constructs _fetch user incoming
 * @constructs endpoint user incoming
 * @constructs fetch_type http / rpc
 */
export default class Feature extends Fetch {
  public constructor(_fetch, endpoint: string, fetch_type: string) {
    super(_fetch, endpoint, fetch_type)
  }

  /**
   * @export Sign_transaction_by_crypto.json
   * @param [*unsigned_tx]
   * @returns [signed_tx]
   */
  public async signTxByCrypto(unsigned_tx: TxRequest.SignedTxByCryptoReq) {
    const privKey = await Account.dumpPrivKeyFromCrypto(
      unsigned_tx.crypto,
      unsigned_tx.pwd
    )
    const unsigned_tx_p = {
      privKey,
      unsignedTx: unsigned_tx.unsignedTx,
      protocalTx: null
    }
    const privk = new PrivateKey(privKey)

    return privk.signTxByPrivKey(unsigned_tx_p)
  }

  /**
   * @export Make_BOX_transaction_by_crypto.json
   * @param [*org_tx]
   * @step [make_privKey->fetch_utxos->make_unsigned_tx->sign_tx->send_tx]
   * @returns [Promise<sent_tx>] { hash: string }
   */
  public async makeBoxTxByCrypto(
    org_tx: TxRequest.MakeBoxTxByCryptoReq
  ): Promise<{ hash: string }> {
    const { from, to, amounts, fee } = org_tx.tx

    /* make privKey */
    const privKey = await Account.dumpPrivKeyFromCrypto(
      org_tx.crypto,
      org_tx.pwd
    )
    let total_to = new BN(0, 10)
    let to_map = {}

    /* fetch utxos */
    await to.forEach((item, index) => {
      to_map[item] = amounts[index]
      total_to = total_to.add(new BN(amounts[index], 10))
    })
    total_to = total_to.add(new BN(fee, 10))
    // console.log('fetchUtxos param :', from, total_to.toString())
    const api = new Api(this._fetch, this.endpoint, this.fetch_type)
    const utxo_res = await api.fetchUtxos({
      addr: from,
      amount: total_to.toString()
    })
    // console.log('fetchUtxos res :', JSON.stringify(utxo_res))

    if (utxo_res['code'] === 0) {
      /* make unsigned tx */
      const unsigned_tx = await Util.makeUnsignedTxHandle({
        from,
        to_map,
        fee,
        utxo_list: utxo_res.utxos
      })
      /* sign tx by privKey */
      const signed_tx = await api.signTxByPrivKey({
        unsignedTx: unsigned_tx.tx_json,
        protocalTx: unsigned_tx.protocalTx,
        privKey
      })
      /* send tx to boxd */

      return await api.sendTx(signed_tx)
    } else {
      throw new Error('Fetch utxos Error')
    }
  }

  /**
   * @export Make_split_transaction_by_crypto.json
   * @param [*org_tx]
   * @returns [Promise<sent_tx>] { splitAddr: string; hash: string }
   */
  public async makeSplitTxByCrypto(
    org_tx: SplitRequest.MakeSplitTxByCryptoReq
  ): Promise<{ splitAddr: string; hash: string }> {
    const api = new Api(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await api.makeUnsignedSplitAddrTx(org_tx.tx)
    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await api.sendTx(signed_tx)
    const split_addr = await Util.calcSplitAddr({
      addrs: org_tx.tx.addrs,
      weights: org_tx.tx.weights,
      txHash: tx_result.hash,
      index: tx_result['index']
    })

    return Object.assign(tx_result, {
      splitAddr: split_addr
    })
  }

  /**
   * @export Issue_token_by_crypto.json
   * @param [*org_tx]
   * @returns [Promise<sent_tx>] { hash: string }
   */
  public async issueTokenByCrypto(
    org_tx: TokenRequest.IssueTokenByCryptoReq
  ): Promise<{ hash: string }> {
    const api = new Api(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await api.makeUnsignedTokenIssueTx(org_tx.tx)
    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })

    return await api.sendTx(signed_tx)
  }

  /**
   * @export Make_token_transaction_by_crypto.json
   * @param [*org_tx]
   * @returns [Promise<sent_tx>] { hash: string }
   */
  public async makeTokenTxByCrypto(
    org_tx: TokenRequest.MakeTokenTxByCryptoReq
  ): Promise<{ hash: string }> {
    const api = new Api(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await api.makeUnsignedTokenTx(org_tx.tx)
    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })

    return await api.sendTx(signed_tx)
  }

  /**
   * @export Make_contract_transaction_by_crypto.json
   * @param [*org_tx]
   * @returns [Promise<sent_tx>] { hash: string }
   */
  public async makeContractTxByCrypto(
    org_tx: ContractRequest.ContractTxByCryptoReq
  ): Promise<{ hash: string; contractAddr: string }> {
    const api = new Api(this._fetch, this.endpoint, this.fetch_type)
    const unsigned_tx = await api.makeUnsignedContractTx(org_tx.tx)

    const signed_tx = await this.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: org_tx.crypto,
      pwd: org_tx.pwd
    })
    const tx_result = await api.sendTx(signed_tx)

    return { hash: tx_result.hash, contractAddr: unsigned_tx.contract_addr }
  }

  /**
   * @export Call_contract
   * @param [*org_tx]
   * @returns [Promise<sent_tx>] { result: string }
   */
  public async callContract(
    callParams: ContractRequest.CallContractReq
  ): Promise<{ result: string }> {
    const api = new Api(this._fetch, this.endpoint, this.fetch_type)
    const result = await api.callContract(callParams)

    return { result: result.output }
  }
}
