import BN from 'bn.js'
import { Fetch } from '../util/fetch'
import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'
import SplitRequest from './split/request'
import TokenRequest from './token/request'
import TxRequest from './tx/request'
import ContractRequest from './contract/request'
import ContractResponse from './contract/response'
import BlockResponse from './block/response'
import SplitResponse from './split/response'
import TokenResponse from './token/response'
import TxResponse from './tx/response'
import Util from '../util/util'

/**
 * @class [Api]
 * @extends Fetch
 * @constructs _fetch user incoming
 * @constructs endpoint user incoming
 * @constructs fetch_type http / rpc
 */
export default class Api extends Fetch {
  public constructor(_fetch, endpoint: string, fetch_type: string) {
    super(_fetch, endpoint, fetch_type)
  }

  /* Block */
  public getNodeInfo(): Promise<BlockResponse.NodeInfo> {
    return super.fetch('/ctl/getnodeinfo')
  }

  public getBlockHashByHeight(blockHeight: number): Promise<{ hash: string }> {
    return super.fetch('/ctl/getblockhash', { blockHeight })
  }

  public getBlockByHash(
    blockHash: string
  ): Promise<{ block: BlockResponse.Block }> {
    return super.fetch('/ctl/getblock', { blockHash })
  }

  public async getBlockByHeight(
    block_height: number
  ): Promise<{ block: BlockResponse.Block }> {
    const block_hash = await this.getBlockHashByHeight(block_height)
    return super.fetch('/ctl/getblock', {
      blockHash: block_hash.hash
    })
  }

  public getBlockHeaderByHash(
    blockHash: string
  ): Promise<{ header: BlockResponse.BlockHeader }> {
    return super.fetch('/ctl/getblockheader', { blockHash })
  }

  public async getBlockHeaderByHeight(
    block_height: number
  ): Promise<{ header: BlockResponse.BlockHeader }> {
    const block_hash = await this.getBlockHashByHeight(block_height)
    return super.fetch('/ctl/getblockheader', {
      blockHash: block_hash.hash
    })
  }

  public getBlockHeight(): Promise<{
    height: number;
  }> {
    return super.fetch('/ctl/getcurrentblockheight')
  }

  public viewBlockDetail(hash: string): Promise<BlockResponse.BlcokDetail> {
    return super.fetch('/block/detail', { hash })
  }

  public getNonce(addr: string): Promise<{ nonce: number }> {
    return super.fetch('/account/nonce', { addr })
  }

  /* Split */
  public makeUnsignedSplitAddrTx(
    split_addr_tx: SplitRequest.SplitAddrTxReq
  ): Promise<SplitResponse.UnsignedSplitAddrTx> {
    return super.fetch('/tx/makeunsignedtx/splitaddr', split_addr_tx)
  }

  /* Token */
  public makeUnsignedTokenIssueTx(
    token_issue_tx: TokenRequest.IssueTokenReq
  ): Promise<TokenResponse.UnsignedTokenIssueTx> {
    return super.fetch('/tx/makeunsignedtx/token/issue', token_issue_tx)
  }

  public async getTokenbalance(
    token: TokenRequest.TokenBalanceReq
  ): Promise<{ balance: number }> {
    token['addrs'] = [token.addr]
    const balances = await super.fetch('/tx/gettokenbalance', token)
    const arr_balances = await balances.balances.map(balance => {
      return new BN(balance, 10).toString()
    })
    return { balance: arr_balances[0] }
  }

  public async getTokenbalances(
    tokens: TokenRequest.TokenBalancesReq
  ): Promise<{ balances: number[] }> {
    const balances = await super.fetch('/tx/gettokenbalance', tokens)
    const arr_balances = await balances.balances.map(balance => {
      return new BN(balance, 10).toString()
    })
    return { balances: arr_balances }
  }

  public makeUnsignedTokenTx(
    token_transfer_tx: TokenRequest.OriginalTokenTxReq
  ): Promise<UtilInterface.UnsignedTx> {
    return super.fetch('/tx/makeunsignedtx/token/transfer', token_transfer_tx)
  }

  /*   public fetchTokenUtxos(fetch_utxos_req: TxRequest.FetchUtxosReq) {
    return super.fetch('/todo', fetch_utxos_req)
  } */

  /* Transaction */
  public faucet(acc_info) {
    return super.fetch('/faucet/claim', acc_info)
  }

  public makeUnsignedTx(
    org_tx: TxRequest.OriginalTxReq
  ): Promise<UtilInterface.UnsignedTx> {
    return super.fetch('/tx/makeunsignedtx', org_tx)
  }

  public signTxByPrivKey(
    unsigned_tx: UtilInterface.SignedTxByPrivKeyReq
  ): Promise<UtilInterface.TX> {
    const _privKey = unsigned_tx.privKey
    const privK = new PrivateKey(_privKey)
    return privK.signTxByPrivKey(unsigned_tx)
  }

  public sendTx(signed_tx: UtilInterface.TX): Promise<{ hash: string }> {
    return super.fetch('/tx/sendtransaction', { tx: signed_tx })
  }

  public viewTxDetail(hash: string): Promise<TxResponse.TxDetail> {
    return super.fetch('/tx/detail', { hash })
  }

  public async getBalance(addr: string): Promise<{ balance: number }> {
    const res = await super.fetch('/tx/getbalance', { addrs: [addr] })
    return new BN(res.balances[0], 10).toString()
  }

  public async getBalances(addrs: string[]): Promise<{ balances: number[] }> {
    const res = await super.fetch('/tx/getbalance', { addrs })
    return await res.balances.map(balance => {
      return new BN(balance, 10).toString()
    })
  }

  public fetchUtxos(
    utxos_req: TxRequest.FetchUtxosReq
  ): Promise<{ utxos: TxResponse.Utxo[] }> {
    return super.fetch('/tx/fetchutxos', utxos_req)
  }

  /**
   * @func create_raw_tx
   * @param [*raw]
   * @param [?is_raw] boolean # is send raw tx ?
   * @branch [next__sendTx_||_sendRawTx]
   * @step [fetchUtxos->makeUnsignTx->signTxByPrivKey]
   * @returns [signed_tx]
   */
  public async createRawTx(raw: TxRequest.Raw, is_raw?) {
    const { addr, to, fee, privKey } = raw
    let total_to = new BN(0, 10)

    // fetch utxos
    await Object.keys(to).forEach(addr => {
      total_to = total_to.add(new BN(to[addr], 10))
    })
    total_to = total_to.add(new BN(fee, 10))
    // console.log('fetchUtxos param :', addr, total_to.toString())
    const utxo_res = await this.fetchUtxos({
      addr,
      amount: total_to.toString()
    })
    // console.log('fetchUtxos res :', JSON.stringify(utxo_res))
    if (utxo_res['code'] === 0) {
      // make unsigned tx
      const utxo_list = utxo_res.utxos
      let unsigned_tx = await Util.makeUnsignedTxHandle({
        from: addr,
        to_map: to,
        fee,
        utxo_list,
        is_raw
      })
      // console.log('unsigned_tx :', JSON.stringify(unsigned_tx))

      // sign tx by privKey
      return await this.signTxByPrivKey({
        unsignedTx: unsigned_tx.tx_json,
        privKey,
        protocalTx: unsigned_tx.protocalTx
      })
    } else {
      throw new Error('Fetch utxos Error')
    }
  }

  // TODO
  public sendRawTx(raw_tx) {
    return super.fetch('/tx/sendrawtransaction', { tx: raw_tx })
  }

  /* Contract */
  public makeUnsignedContractTx(
    org_tx: ContractRequest.OriginalContractReq
  ): Promise<ContractResponse.UnsignedContractTx> {
    return super.fetch('/tx/makeunsignedtx/contract', org_tx)
  }

  public callContract(
    org_tx: ContractRequest.CallContractReq
  ): Promise<ContractResponse.CallContractResp> {
    return super.fetch('/contract/call', org_tx)
  }

  public getLogs(
    logs_req: ContractRequest.GetLogsReq
  ): Promise<ContractResponse.LogDetail[]> {
    return super.fetch('/contract/getLogs', logs_req)
  }
}
