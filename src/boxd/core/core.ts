import { RPC } from '../util/rpc'
/* import {
  addNode,
  getBlock,
  getBlockHash,
  getBlockHeader,
  getBlockHeight,
  getNodeInfo,
  viewBlockDetail
} from './block/block' */
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
  /*   addNode(nodeId) {
    addNode(this.fetch, nodeId)
  }
  getBlock(param) {
    getBlock(this.fetch, param)
  }
  getBlockHash(blockHeight) {
    getBlockHash(this.fetch, blockHeight)
  }
  getBlockHeader(param) {
    getBlockHeader(this.fetch, param)
  }
  getBlockHeight() {
    getBlockHeight(this.fetch)
  }
  getNodeInfo() {
    getNodeInfo(this.fetch)
  }
  viewBlockDetail(hash) {
    viewBlockDetail(this.fetch, hash)
  } */
}

/* export class Core extends Rpc {
  constructor(endpoint: string, _fetch: any) {
    super(endpoint, _fetch)
  }
  fetch(_fetch: string, body: object = {}) {
    console.log('Slithering...')
    super.fetch(_fetch, body)
  }
  // block
  addNode(nodeId) {
    addNode(this.fetch, nodeId)
  }
  getBlock(param) {
    getBlock(this.fetch, param)
  }
  getBlockHash(blockHeight) {
    getBlockHash(this.fetch, blockHeight)
  }
  getBlockHeader(param) {
    getBlockHeader(this.fetch, param)
  }
  getBlockHeight() {
    getBlockHeight(this.fetch)
  }
  getNodeInfo() {
    getNodeInfo(this.fetch)
  }
  viewBlockDetail(hash) {
    viewBlockDetail(this.fetch, hash)
  }
  // split
  makeUnsignedSplitAddrTx(split_addr_tx) {
    makeUnsignedSplitAddrTx(this.fetch, split_addr_tx)
  }
} */
