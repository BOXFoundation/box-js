import bitcore from 'bitcore-lib'
import { UnsignedTxReq, Raw } from '../request'
import { fetchRPC } from '../../util/rpc'
// const OP_CODE_TYPE = 'hex'

export class Transaction {
  TX
  constructor(opt) {
    this.TX = new bitcore.Transaction()
    this._fetch = opt.fetch
  }

  /**
   * @export make-Unsigned-Tx
   * @param [*tx] TX
   * @returns [promise]
   */
  makeUnsignedTx = async (endpoint: string, tx: UnsignedTxReq) => {
    return await fetchRPC(this._fetch, endpoint, '/tx/makeunsignedtx', tx)
  }

  /**
   * @export send-Transaction
   * @param [*signedTx]
   * @returns [promise]
   */
  sendTransaction = async (_fetch: any, endpoint: string, signed_tx) => {
    return await fetchRPC(_fetch, endpoint, '/tx/sendtransaction', signed_tx)
  }

  /**
   * @export create-Raw-Transaction
   * @param [*raw] Raw
   * @returns [promise]
   */
  createRawTransaction = async (_fetch: any, endpoint: string, raw: Raw) => {
    return await fetchRPC(_fetch, endpoint, '/tx/getrawtransaction', raw)
  }

  /**
   * @export send-Raw-Transaction
   * @param [*raw_tx] string
   * @returns [promise]
   */
  sendRawTransaction = async (
    _fetch: any,
    endpoint: string,
    raw_tx: string
  ) => {
    return await fetchRPC(_fetch, endpoint, '/todo', { raw_tx })
  }

  /**
   * @export get-Account-Balance
   * @param [*addr] bitcore.Address
   * @returns [balance] string
   */
  getBalance = async (_fetch: any, endpoint: string, addr: string) => {
    return await fetchRPC(_fetch, endpoint, '/tx/getbalance', { addr })
  }

  /**
   * @export get-Account-Balances-Array
   * @param [*addr] bitcore.Address[]
   * @returns [balances] string[]
   */
  getBalances = async (_fetch: any, endpoint: string, addrs: string[]) => {
    return await fetchRPC(_fetch, endpoint, '/tx/getbalance', { addrs })
  }

  /**
   * @export view-TX-Detail
   * @param [hash] string
   * @returns [promise]
   */
  viewTxDetail = async (_fetch: any, endpoint: string, hash: string) => {
    return _fetch(_fetch, endpoint, '/tx/detail', { hash })
  }
}
