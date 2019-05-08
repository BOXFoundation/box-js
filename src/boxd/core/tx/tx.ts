import bitcore from 'bitcore-lib'
import { TX, Raw } from '../request'
import { getSignHash, signatureScript } from '../../util/util'

/**
 * @export create-Raw-Transaction
 * @param [*raw] Raw
 * @returns [promise]
 */
export const createRawTransaction = (_fetch: any, raw: Raw) => {
  return _fetch('/tx/getrawtransaction', raw)
}

/**
 * @export send-Raw-Transaction
 * @param [*raw_tx] string
 * @returns [promise]
 */
export const sendRawTransaction = (_fetch: any, raw_tx: string) => {
  return _fetch('/todo', raw_tx)
}

/**
 * @export make-Unsigned-Tx
 * @param [*tx] TX
 * @returns [promise]
 */
export const makeUnsignedTx = (_fetch: any, tx: TX) => {
  return _fetch('/tx/makeunsignedtx', tx)
}

/**
 * @export sign-Transaction
 * @param [*tx] TX
 * @returns [promise]
 */
export const signTransaction = (acc, tx, protoBufs) => {
  for (let idx = 0; idx < tx.vin.length; idx++) {
    const sigHashBuf = getSignHash(protoBufs[idx])
    const signBuf = acc.signMsg(sigHashBuf)
    const scriptSig = signatureScript(signBuf, acc.toPublicKey().toBuffer())
    tx.vin[idx].script_sig = scriptSig.toString('base64')
  }
  return tx
}

/**
 * @export send-Transaction
 * @param [*signedTx]
 * @returns [promise]
 */
export const sendTransaction = (_fetch: any, signedTx) => {
  return _fetch('/tx/sendtransaction', signedTx)
}

/**
 * @export get-Account-Balance
 * @param [*addr] bitcore.Address
 * @returns [balance] string
 */
export const getBalance = (_fetch: any, addr: bitcore.Address): string => {
  return _fetch('/tx/getbalance', addr)
}

/**
 * @export get-Account-Balances-Array
 * @param [*addr] bitcore.Address[]
 * @returns [balances] string[]
 */
export const getBalances = (
  _fetch: any,
  addrs: bitcore.Address[]
): string[] => {
  return _fetch('/tx/getbalance', addrs)
}

/**
 * @export view-TX-Detail
 * @param [hash] string
 * @returns [promise]
 */
export const viewTxDetail = (_fetch: any, hash: string) => {
  return _fetch('/tx/detail', hash)
}
