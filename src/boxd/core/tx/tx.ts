import bitcore from 'bitcore-lib'
import { TX } from './request'

const OP_CODE_TYPE = 'hex'

export default class Account {
  constructor() {}

  /**
   * @func UnsignedTx
   * @param [*from] bitcore.Address
   * @param {[]string} toAddrs
   * @param {[]<number>} amounts
   * @param {number} fee
   * @memberof JsonRpc
   */
  UnsignedTx(tx: TX) {
    const { from, to, amounts, fee } = tx
    return this.fetch('/tx/makeunsignedtx', {
      from,
      to,
      amounts,
      fee
    })
  }
}
