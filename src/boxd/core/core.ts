import { RPC } from '../util/rpc'
import Block from './block/block'
import Split from './split/split'
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
    return Split.makeUnsignedSplitAddrTx(
      this._fetch,
      this.endpoint,
      split_addr_tx
    )
  }

  // block
  addNode(nodeId) {
    Block.addNode(this._fetch, this.endpoint, nodeId)
  }
  getBlockByHeight(height) {
    Block.getBlockByHeight(this._fetch, this.endpoint, height)
  }
  getBlockByBlockHash(blockHash) {
    Block.getBlockByBlockHash(this._fetch, this.endpoint, blockHash)
  }
  getBlockHash(blockHeight) {
    Block.getBlockHash(this._fetch, this.endpoint, blockHeight)
  }
  getBlockHeaderByHeight(height) {
    Block.getBlockHeaderByHeight(this._fetch, this.endpoint, height)
  }
  getBlockHeaderByHash(hash) {
    Block.getBlockHeaderByHash(this._fetch, this.endpoint, hash)
  }
  getBlockHeight() {
    Block.getBlockHeight(this._fetch, this.endpoint)
  }
  getNodeInfo() {
    Block.getNodeInfo(this._fetch, this.endpoint)
  }
  viewBlockDetail(hash) {
    Block.viewBlockDetail(this._fetch, this.endpoint, hash)
  }
}
