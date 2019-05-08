import { RPC } from '../util/rpc'
import {
  addNode,
  getBlockByHeight,
  getBlockByBlockHash,
  getBlockHash,
  getBlockHeaderByHeight,
  getBlockHeaderByHash,
  getBlockHeight,
  getNodeInfo,
  viewBlockDetail
} from './block/block'
import { makeUnsignedSplitAddrTx } from './split/split'
// import { makeUnsignedTx } from './tx/tx'
import { SplitAddrTxReq } from './request'

/**
 * @class [Core]
 * @extends RPC
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
export class Core extends RPC {
  constructor(_fetch: any, endpoint: string) {
    super(_fetch, endpoint)
  }

  // split
  makeUnsignedSplitAddrTx(split_addr_tx: SplitAddrTxReq) {
    return makeUnsignedSplitAddrTx(this._fetch, this.endpoint, split_addr_tx)
  }

  // block
  addNode(nodeId) {
    addNode(this._fetch, this.endpoint, nodeId)
  }
  getBlockByHeight(height) {
    getBlockByHeight(this._fetch, this.endpoint, height)
  }
  getBlockByBlockHash(blockHash) {
    getBlockByBlockHash(this._fetch, this.endpoint, blockHash)
  }
  getBlockHash(blockHeight) {
    getBlockHash(this._fetch, this.endpoint, blockHeight)
  }
  getBlockHeaderByHeight(height) {
    getBlockHeaderByHeight(this._fetch, this.endpoint, height)
  }
  getBlockHeaderByHash(hash) {
    getBlockHeaderByHash(this._fetch, this.endpoint, hash)
  }
  getBlockHeight() {
    getBlockHeight(this._fetch, this.endpoint)
  }
  getNodeInfo() {
    getNodeInfo(this._fetch, this.endpoint)
  }
  viewBlockDetail(hash) {
    viewBlockDetail(this._fetch, this.endpoint, hash)
  }
}
