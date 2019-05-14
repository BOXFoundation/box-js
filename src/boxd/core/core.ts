import { Http } from '../util/rpc'
import { PrivateKey } from '../util/crypto/privatekey'
import CoreRequest from './request'
import UtilRequest from '../util/request'
import CoreResponse from './response'

/**
 * @class [Core]
 * @extends Http
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export class Core extends Http {
  constructor(_fetch: any, endpoint: string) {
    super(_fetch, endpoint)
  }

  // split
  makeUnsignedSplitAddrTx(split_addr_tx: CoreRequest.SplitAddrTxReq) {
    return super.httpFetch('/tx/makeunsignedtx/splitaddr', split_addr_tx)
  }

  // token
  makeUnsignedTokenIssueTx(token_issue_tx: CoreRequest.TokenIssueTxReq) {
    return super.httpFetch('/tx/makeunsignedtx/token/issue', token_issue_tx)
  }

  getTokenbalance(token: CoreRequest.TokenBalanceReq) {
    token['addrs'] = [token.addr]
    return super.httpFetch('/tx/gettokenbalance', token)
  }

  getTokenbalances(tokens: CoreRequest.TokenBalancesReq) {
    return super.httpFetch('/tx/gettokenbalance', tokens)
  }

  makeUnsignedTokenTransferTx(token_transfer_tx: CoreRequest.OrgTokenTxReq) {
    return super.httpFetch(
      '/tx/makeunsignedtx/token/transfer',
      token_transfer_tx
    )
  }

  // TX
  makeUnsignedTx(tx: CoreRequest.OrgTxReq) {
    return super.httpFetch('/tx/makeunsignedtx', tx)
  }

  signTransactionByPrivKey(unsigned_tx: UtilRequest.SignedTxByPrivKeyReq) {
    const _privKey = unsigned_tx.privKey
    const privK = new PrivateKey(_privKey)
    return privK.signTransactionByPrivKey(unsigned_tx)
  }

  sendTransaction(signed_tx: CoreResponse.TX) {
    return super.httpFetch('/tx/sendtransaction', { tx: signed_tx })
  }

  viewTxDetail(hash: string) {
    return super.httpFetch('/tx/detail', { hash })
  }

  getBalance(addr: string) {
    return super.httpFetch('/tx/getbalance', { addrs: [addr] })
  }

  getBalances(addrs: string[]) {
    return super.httpFetch('/tx/getbalance', { addrs })
  }

  fetchUtxos(fetch_utxos_req: CoreRequest.SetchUtxosReq) {
    return super.httpFetch('/tx/fetchutxos', fetch_utxos_req, false)
  }

  /*   public async createRawTransaction(raw: CoreRequest.Raw) {
    const { addr, to, amount, fee, privKey } = raw
    await this.fetchUtxos({ addr, amount })
      .then(res => {
        if ((res.code = 0)) {
          const utxos: CoreResponse.Utxo[] = res.utxos
          console.log('utxos:', utxos)
          super
            .httpFetch('/tx/getrawtransaction', {
              from: addr,
              to,
              fee,
              utxos
            })
            .then(res => {
              console.log('unsigned_tx:', res)
              console.log('privKey:', privKey)
            })
        } else {
          throw new Error('createRawTransaction Error')
        }
      })
      .catch(err => {
        console.log('createRawTransaction Error:', err)
        throw new Error('createRawTransaction Error')
      })
  } */

  sendRawTransaction(raw_tx: string) {
    return super.httpFetch('/todo', { raw_tx })
  }

  // block
  // todo
  getNodeInfo() {
    return super.httpFetch('/ctl/getnodeinfo', {}, false)
  }

  addNode(nodeId: string) {
    return super.httpFetch('/ctl/addnode', { nodeId }, false)
  }

  getBlockHashByHeight(blockHeight: number) {
    return super.httpFetch('/ctl/getblockhash', { blockHeight })
  }

  getBlockByHash(blockHash: string) {
    return super.httpFetch('/ctl/getblock', { blockHash })
  }

  public async getBlockByHeight(block_height: number) {
    return await this.getBlockHashByHeight(block_height)
      .then(block_hash => {
        // console.log('getBlockHashByHeight res:', block_hash)
        return super.httpFetch('/ctl/getblock', {
          blockHash: block_hash.hash
        })
      })
      .catch(err => {
        console.log('getBlockHashByHeight Error:', err)
        throw new Error('getBlockHashByHeight Error')
      })
  }

  getBlockHeaderByHash(blockHash: string) {
    return super.httpFetch('/ctl/getblockheader', { blockHash })
  }

  public async getBlockHeaderByHeight(block_height: number) {
    return await this.getBlockHashByHeight(block_height)
      .then(block_hash => {
        // console.log('getBlockHashByHeight res:', block_hash)
        return super.httpFetch('/ctl/getblockheader', {
          blockHash: block_hash.hash
        })
      })
      .catch(err => {
        console.log('getBlockHashByHeight Error:', err)
        throw new Error('getBlockHashByHeight Error')
      })
  }

  getBlockHeight() {
    return super.httpFetch('/ctl/getblockheight')
  }

  viewBlockDetail(hash: string) {
    return super.httpFetch('/block/detail', { hash })
  }
}
