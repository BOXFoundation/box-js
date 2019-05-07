import { Rpc } from '../util/util'
import {
  addNode,
  getBlock,
  getBlockHash,
  getBlockHeader,
  getBlockHeight,
  getNodeInfo,
  viewBlockDetail
} from './block/block'
import { makeUnsignedSplitAddrTx } from './split/split'
// import { makeUnsignedTx } from './tx/tx'

export default class Core extends Rpc {
  constructor(endpoint: string, fetch: any) {
    super(endpoint, fetch)
  }
  // block
  addNode(nodeId) {
    addNode(super._fetch, nodeId)
  }
  getBlock(param) {
    getBlock(super._fetch, param)
  }
  getBlockHash(blockHeight) {
    getBlockHash(super._fetch, blockHeight)
  }
  getBlockHeader(param) {
    getBlockHeader(super._fetch, param)
  }
  getBlockHeight() {
    getBlockHeight(super._fetch)
  }
  getNodeInfo() {
    getNodeInfo(super._fetch)
  }
  viewBlockDetail(hash) {
    viewBlockDetail(super._fetch, hash)
  }

  // split
  makeUnsignedSplitAddrTx(split_addr_tx) {
    makeUnsignedSplitAddrTx(super._fetch, split_addr_tx)
  }
}
