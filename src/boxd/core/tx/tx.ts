import { UnsignedTxReq, Raw } from '../request'
import { fetchRPC } from '../../util/rpc'

namespace TX {
  /**
   * @export make-Unsigned-Tx
   * @param [*tx] TX
   * @returns [promise]
   */
  export const makeUnsignedTx = async (
    _fetch: any,
    endpoint: string,
    tx: UnsignedTxReq
  ) => {
    return await fetchRPC(_fetch, endpoint, '/tx/makeunsignedtx', tx)
  }

  /**
   * @export sign-Transaction-by-PrivKey
   * @param [*unSignedTx] SignedTxByPrivKeyReq
   * @returns [tx]
   */
  /*   export const signTransactionByPrivKey = async (
    unSignedTx: SignedTxByPrivKeyReq
  ) => {
    // return tx
  } */

  /**
   * @export create-Raw-Transaction
   * @param [*raw] Raw
   * @returns [promise]
   */
  export const createRawTransaction = async (
    _fetch: any,
    endpoint: string,
    raw: Raw
  ) => {
    return await fetchRPC(_fetch, endpoint, '/tx/getrawtransaction', raw)
  }

  /**
   * @export send-Raw-Transaction
   * @param [*raw_tx] string
   * @returns [promise]
   */
  export const sendRawTransaction = async (
    _fetch: any,
    endpoint: string,
    raw_tx: string
  ) => {
    return await fetchRPC(_fetch, endpoint, '/todo', { raw_tx })
  }

  /**
   * @export send-Transaction
   * @param [*signedTx]
   * @returns [promise]
   */
  export const sendTransaction = async (
    _fetch: any,
    endpoint: string,
    signedTx
  ) => {
    return await fetchRPC(_fetch, endpoint, '/tx/sendtransaction', signedTx)
  }

  /**
   * @export get-Account-Balance
   * @param [*addr] bitcore.Address
   * @returns [balance] string
   */
  export const getBalance = async (
    _fetch: any,
    endpoint: string,
    addr: string
  ) => {
    return await fetchRPC(_fetch, endpoint, '/tx/getbalance', { addr })
  }

  /**
   * @export get-Account-Balances-Array
   * @param [*addr] bitcore.Address[]
   * @returns [balances] string[]
   */
  export const getBalances = async (
    _fetch: any,
    endpoint: string,
    addrs: string[]
  ) => {
    return await fetchRPC(_fetch, endpoint, '/tx/getbalance', { addrs })
  }

  /**
   * @export view-TX-Detail
   * @param [hash] string
   * @returns [promise]
   */
  export const viewTxDetail = async (
    _fetch: any,
    endpoint: string,
    hash: string
  ) => {
    return _fetch(_fetch, endpoint, '/tx/detail', { hash })
  }
}

export default TX
