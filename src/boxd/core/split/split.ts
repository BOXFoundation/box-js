import { SplitCreate } from './request'

/**
 * @export make-Unsigned-Split-Address-Tx
 * @param [*split_addr_tx] SplitAddrTx
 * @returns [response]
 */
export const makeUnsignedSplitAddrTx = (
  _fetch: any,
  split_addr_tx: SplitCreate
) => {
  console.log('makeUnsignedSplitAddrTx:', _fetch, split_addr_tx)
  return _fetch('/tx/makeunsignedtx', split_addr_tx)
}
