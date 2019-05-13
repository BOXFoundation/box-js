import { Http } from '../util/rpc'
import Block from './block/block'
// import Split from './split/split'
// import { Transaction } from './tx/tx'
import { PrivateKey } from '../util/crypto/privatekey'
import CoreRequest from './request'
import UtilRequest from '../util/request'
import coreResponse from './response'

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
  makeUnsignedTokenIssueTx(token_issue_tx: CoreRequest.TokenIssueTx) {
    return super.httpFetch('/tx/makeunsignedtx/token/issue', token_issue_tx)
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

  sendTransaction(signed_tx: coreResponse.TX) {
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

  createRawTransaction(raw: CoreRequest.Raw) {
    return super.httpFetch('/tx/getrawtransaction', raw)
  }

  sendRawTransaction(raw_tx: string) {
    return super.httpFetch('/todo', { raw_tx })
  }

  // block
  addNode(nodeId) {
    return Block.addNode(this._fetch, this.endpoint, nodeId)
  }
  getBlockByHeight(height) {
    return Block.getBlockByHeight(this._fetch, this.endpoint, height)
  }
  getBlockByBlockHash(blockHash) {
    return Block.getBlockByBlockHash(this._fetch, this.endpoint, blockHash)
  }
  getBlockHash(blockHeight) {
    return Block.getBlockHash(this._fetch, this.endpoint, blockHeight)
  }
  getBlockHeaderByHeight(height) {
    return Block.getBlockHeaderByHeight(this._fetch, this.endpoint, height)
  }
  getBlockHeaderByHash(hash) {
    return Block.getBlockHeaderByHash(this._fetch, this.endpoint, hash)
  }
  getBlockHeight() {
    return Block.getBlockHeight(this._fetch, this.endpoint)
  }
  getNodeInfo() {
    return Block.getNodeInfo(this._fetch, this.endpoint)
  }
  viewBlockDetail(hash) {
    return Block.viewBlockDetail(this._fetch, this.endpoint, hash)
  }
}
