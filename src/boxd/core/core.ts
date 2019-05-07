import { Rpc } from '../util/util'
import { makeUnsignedTx } from './tx/tx'
import { TX } from './tx/request'

const OP_CODE_TYPE = 'hex'

export default class Core extends Rpc {
  constructor(endpoint: string, fetch: any) {
    super(endpoint, fetch)
  }
  makeUnsignedTx(tx: TX) {
    makeUnsignedTx(super._fetch, tx)
  }
}
