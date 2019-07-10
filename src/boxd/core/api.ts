import { Fetch } from '../util/fetch'
import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'
// import BlockRequest from './block/request'
import SplitRequest from './split/request'
import TokenRequest from './token/request'
import TxRequest from './tx/request'
import ContractRequest from './contract/request'
import ContractResponse from './contract/response'
import BlockResponse from './block/response'
import SplitResponse from './split/response'
import TokenResponse from './token/response'
import TxResponse from './tx/response'
import TxUtil from './tx/util'

/**
 * @class [Api]
 * @extends Fetch
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export default class Api extends Fetch {
  public constructor(_fetch: any, endpoint: string, fetch_type) {
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
    return await this.getBlockHashByHeight(block_height)
      .then(block_hash => {
        // console.log('getBlockHashByHeight res:', block_hash)
        return super.fetch('/ctl/getblock', {
          blockHash: block_hash.hash
        })
      })
      .catch(err => {
        console.log('getBlockHashByHeight Error:', err)
        throw new Error('getBlockHashByHeight Error')
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
    return await this.getBlockHashByHeight(block_height)
      .then(block_hash => {
        // console.log('getBlockHashByHeight res:', block_hash)
        return super.fetch('/ctl/getblockheader', {
          blockHash: block_hash.hash
        })
      })
      .catch(err => {
        console.log('getBlockHashByHeight Error:', err)
        throw new Error('getBlockHashByHeight Error')
      })
  }

  public getBlockHeight(): Promise<{
  height: number;
  }> {
    return super.fetch('/ctl/getblockheight')
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
    const arr_balances = await balances.balances.map(item => {
      return Number(item)
    })
    return { balance: arr_balances[0] }
  }

  public async getTokenbalances(
    tokens: TokenRequest.TokenBalancesReq
  ): Promise<{ balances: number[] }> {
    const balances = await super.fetch('/tx/gettokenbalance', tokens)
    const arr_balances = await balances.balances.map(item => {
      return Number(item)
    })
    return { balances: arr_balances }
  }

  public makeUnsignedTokenTx(
    token_transfer_tx: TokenRequest.OriginalTokenTxReq
  ): Promise<UtilInterface.UnsignedTx> {
    return super.fetch('/tx/makeunsignedtx/token/transfer', token_transfer_tx)
  }

  public fetchTokenUtxos(fetch_utxos_req: TxRequest.FetchUtxosReq) {
    return super.fetch('/todo', fetch_utxos_req)
  }

  /* Transaction */
  public faucet(req) {
    return super.fetch('/faucet/claim', req)
  }

  public makeUnsignedTx(
    tx: TxRequest.OriginalTxReq
  ): Promise<UtilInterface.UnsignedTx> {
    return super.fetch('/tx/makeunsignedtx', tx)
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
    const balances = await super.fetch('/tx/getbalance', { addrs: [addr] })
    const arr_balances = await balances.balances.map(item => {
      return Number(item)
    })
    return { balance: arr_balances[0] }
  }

  public async getBalances(addrs: string[]): Promise<{ balances: number[] }> {
    const balances = await super.fetch('/tx/getbalance', { addrs })
    const arr_balances = await balances.balances.map(item => {
      return Number(item)
    })
    return { balances: arr_balances }
  }

  // NOW
  public fetchUtxos(
    utxos_req: TxRequest.FetchUtxosReq
  ): Promise<{ utxos: TxResponse.Utxo[] }> {
    return super.fetch('/tx/fetchutxos', utxos_req)
  }

  public async createRawTx(raw: TxRequest.Raw) {
    const { addr, to, fee } = raw
    let sum = 0
    await Object.keys(to).forEach(item => {
      sum += Number(to[item])
    })
    sum += Number(fee)
    console.log('fetchUtxos param :', addr, sum)
    await this.fetchUtxos({ addr, amount: sum })
      .then(async res => {
        console.log('fetchUtxos res :', JSON.stringify(res))
        if (res['code'] === 0) {
          // TODO 序列化 -> sign ->
          const utxo_list = res.utxos
          const unsigned_tx = await TxUtil.makeUnsignTx({
            from: addr,
            to_map: to,
            fee,
            utxo_list
          })
          console.log('unsigned_tx :', unsigned_tx)
          /* return this.signTxByPrivKey({
                unsignedTx: {
                  tx: unsigned_tx.tx,
                  rawMsgs: unsigned_tx.rawMsgs
                },
                privKey
              }) */
        } else {
          throw new Error('createRawTx Error')
        }
      })
      .catch(err => {
        console.log('createRawTx Error:', err)
        throw new Error('createRawTx Error')
      })
  }

  public sendRawTx(raw_tx: string) {
    return super.fetch('/tx/sendrawtransaction', { raw_tx })
  }

  /* Contract */
  public makeUnsignedContractTx(
    tx: ContractRequest.OriginalContractReq
  ): Promise<ContractResponse.UnsignedContractTx> {
    return super.fetch('/tx/makeunsignedtx/contract', tx)
  }

  public callContract(
    tx: ContractRequest.CallContractReq
  ): Promise<ContractResponse.CallContractResp> {
    return super.fetch('/contract/call', tx)
  }

  public getLogs(
    logs_req: ContractRequest.GetLogsReq
  ): Promise<ContractResponse.LogDetail[]> {
    return super.fetch('/contract/getLogs', logs_req)
  }
}
