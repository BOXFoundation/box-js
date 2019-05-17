import { Fetch } from '../util/fetch'
import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'
// import BlockRequest from './block/request'
import SplitRequest from './split/request'
import TokenRequest from './token/request'
import TxRequest from './tx/request'
// import BlockResponse from './block/response'
import SplitResponse from './split/response'
// import TokenResponse from './token/response'
import TxResponse from './tx/response'

/**
 * @class [Core]
 * @extends Http
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export default class Core extends Fetch {
  constructor(_fetch: any, endpoint: string, fetch_type) {
    super(_fetch, endpoint, fetch_type)
  }

  // split
  makeUnsignedSplitAddrTx(
    split_addr_tx: SplitRequest.SplitAddrTxReq
  ): Promise<SplitResponse.UnsignedSplitAddrTx> {
    return super.fetch('/tx/makeunsignedtx/splitaddr', split_addr_tx)
  }

  // token
  makeUnsignedTokenIssueTx(token_issue_tx: TokenRequest.TokenIssueTxReq) {
    return super.fetch('/tx/makeunsignedtx/token/issue', token_issue_tx)
  }

  getTokenbalance(token: TokenRequest.TokenBalanceReq) {
    token['addrs'] = [token.addr]
    return super.fetch('/tx/gettokenbalance', token)
  }

  getTokenbalances(tokens: TokenRequest.TokenBalancesReq) {
    return super.fetch('/tx/gettokenbalance', tokens)
  }

  makeUnsignedTokenTransferTx(token_transfer_tx: TokenRequest.OrgTokenTxReq) {
    return super.fetch('/tx/makeunsignedtx/token/transfer', token_transfer_tx)
  }

  fetchTokenUtxos(fetch_utxos_req: TxRequest.SetchUtxosReq) {
    return super.fetch('todo', fetch_utxos_req)
  }

  // TX
  makeUnsignedTx(tx: TxRequest.OrgTxReq) {
    return super.fetch('/tx/makeunsignedtx', tx)
  }

  signTransactionByPrivKey(unsigned_tx: UtilInterface.SignedTxByPrivKeyReq) {
    const _privKey = unsigned_tx.privKey
    const privK = new PrivateKey(_privKey)
    return privK.signTransactionByPrivKey(unsigned_tx)
  }

  sendTransaction(signed_tx: TxResponse.TX) {
    return super.fetch('/tx/sendtransaction', { tx: signed_tx })
  }

  viewTxDetail(hash: string) {
    return super.fetch('/tx/detail', { hash })
  }

  getBalance(addr: string) {
    return super.fetch('/tx/getbalance', { addrs: [addr] })
  }

  getBalances(addrs: string[]) {
    return super.fetch('/tx/getbalance', { addrs })
  }

  fetchUtxos(fetch_utxos_req: TxRequest.SetchUtxosReq) {
    return super.fetch('/tx/fetchutxos', fetch_utxos_req)
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
            .fetch(
              '/tx/getrawtransaction',
              {
                from: addr,
                to,
                fee,
                utxos
              },
              false
            )
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

  // block
  getNodeInfo() {
    return super.fetch('/ctl/getnodeinfo', {}, false)
  }

  addNode(nodeId: string) {
    return super.fetch('/ctl/addnode', { nodeId }, false)
  }

  getBlockHashByHeight(blockHeight: number) {
    return super.fetch('/ctl/getblockhash', { blockHeight })
  }

  getBlockByHash(blockHash: string) {
    return super.fetch('/ctl/getblock', { blockHash })
  }

  public async getBlockByHeight(block_height: number) {
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

  getBlockHeaderByHash(blockHash: string) {
    return super.fetch('/ctl/getblockheader', { blockHash })
  }

  public async getBlockHeaderByHeight(block_height: number) {
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

  getBlockHeight() {
    return super.fetch('/ctl/getblockheight')
  }

  viewBlockDetail(hash: string) {
    return super.fetch('/block/detail', { hash })
  }
}
