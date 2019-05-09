import { RPC } from '../util/rpc'
import Block from './block/block'
import Split from './split/split'
import TX from './tx/tx'
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
    return Split.makeUnsignedSplitAddrTx(
      this._fetch,
      this.endpoint,
      split_addr_tx
    )
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

  // TX
  makeUnsignedTx(tx) {
    return TX.makeUnsignedTx(this._fetch, this.endpoint, tx)
  }
}
