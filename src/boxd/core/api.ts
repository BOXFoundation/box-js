import { Fetch } from '../util/fetch'
import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'
// import BlockRequest from './block/request'
import SplitRequest from './split/request'
import TokenRequest from './token/request'
import TxRequest from './tx/request'
import BlockResponse from './block/response'
import SplitResponse from './split/response'
import TokenResponse from './token/response'
import TxResponse from './tx/response'

/**
 * @class [Api]
 * @extends Fetch
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export default class Api extends Fetch {
  constructor(_fetch: any, endpoint: string, fetch_type) {
    super(_fetch, endpoint, fetch_type)
  }

  // Block
  getNodeInfo(): Promise<BlockResponse.NodeInfo> {
    return super.fetch('/ctl/getnodeinfo')
  }

  /* UNDO
    addNode(nodeId: string) {
    return super.fetch('/ctl/addnode', { nodeId })
  } */

  getBlockHashByHeight(blockHeight: number): Promise<{ hash: string }> {
    return super.fetch('/ctl/getblockhash', { blockHeight })
  }

  getBlockByHash(blockHash: string): Promise<{ block: BlockResponse.Block }> {
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

  getBlockHeaderByHash(
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

  getBlockHeight(): Promise<{
    height: number
  }> {
    return super.fetch('/ctl/getblockheight')
  }

  viewBlockDetail(hash: string): Promise<BlockResponse.BlcokDetail> {
    return super.fetch('/block/detail', { hash })
  }

  // Split
  makeUnsignedSplitAddrTx(
    split_addr_tx: SplitRequest.SplitAddrTxReq
  ): Promise<SplitResponse.UnsignedSplitAddrTx> {
    return super.fetch('/tx/makeunsignedtx/splitaddr', split_addr_tx)
  }

  // Token
  makeUnsignedTokenIssueTx(
    token_issue_tx: TokenRequest.TokenIssueTxReq
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

  makeUnsignedTokenTransferTx(
    token_transfer_tx: TokenRequest.OriginalTokenTxReq
  ): Promise<TokenResponse.UnsignedTokenTx> {
    return super.fetch('/tx/makeunsignedtx/token/transfer', token_transfer_tx)
  }

  fetchTokenUtxos(fetch_utxos_req: TxRequest.SetchUtxosReq) {
    return super.fetch('todo', fetch_utxos_req)
  }

  // TX
  faucet(req) {
    return super.fetch('/faucet/claim', req)
  }

  makeUnsignedTx(tx: TxRequest.OriginalTxReq): Promise<TxResponse.UnsignedTx> {
    return super.fetch('/tx/makeunsignedtx', tx)
  }

  signTransactionByPrivKey(
    unsigned_tx: UtilInterface.SignedTxByPrivKeyReq
  ): Promise<TxResponse.TX> {
    const _privKey = unsigned_tx.privKey
    const privK = new PrivateKey(_privKey)
    return privK.signTransactionByPrivKey(unsigned_tx)
  }

  sendTransaction(signed_tx: TxResponse.TX): Promise<{ hash: string }> {
    return super.fetch('/tx/sendtransaction', { tx: signed_tx })
  }

  viewTxDetail(hash: string): Promise<TxResponse.TxDetail> {
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

  fetchUtxos(fetch_utxos_req: TxRequest.SetchUtxosReq) {
    return super.fetch('/tx/fetchutxos', fetch_utxos_req)
  }

  // TODO Raw
  makeUnsignedContractTx(
    tx: TxRequest.OriginalTxReq
  ): Promise<TxResponse.UnsignedTx> {
    return super.fetch('/todo', tx)
  }

  public async createRawTransaction(raw: TxRequest.Raw) {
    const { addr, to, fee, privKey } = raw
    let sum = 0
    await Object.keys(to).forEach(item => {
      sum += Number(to[item])
    })
    sum += Number(fee)
    console.log('fetchUtxos:', addr, sum)
    await this.fetchUtxos({ addr, amount: sum })
      .then(async res => {
        console.log('fetchUtxos res:', res)
        if (res.code === 0) {
          // todo 序列化 -> sign ->
          const utxos: TxResponse.Utxo[] = res.utxos
          await super
            .fetch('/tx/getrawtransaction', {
              from: addr,
              to,
              fee,
              utxos
            })
            .then(res => {
              console.log('unsigned_tx:', res)
              console.log('privKey:', privKey)
              // todo verify
              return this.signTransactionByPrivKey({
                unsignedTx: {
                  tx: res.tx,
                  rawMsgs: res.rawMsgs
                },
                privKey
              })
            })
        } else {
          throw new Error('createRawTransaction Error')
        }
      })
      .catch(err => {
        console.log('createRawTransaction Error:', err)
        throw new Error('createRawTransaction Error')
      })
  }

  /**
   * @func sendRawTransaction
   * @param [*raw_tx] # 序列化后的 raw tx
   */
  sendRawTransaction(raw_tx: string) {
    return super.fetch('/tx/sendrawtransaction', { raw_tx })
  }
}
