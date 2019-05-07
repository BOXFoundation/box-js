import { SplitCreate } from './request'

/**
 * @export make-Unsigned-Split-Address-Tx
 * @param [*SplitAddrTx] SplitAddrTx
 * @returns [response]
 */
export const makeUnsignedSplitAddrTx = (
  _fetch: any,
  SplitAddrTx: SplitCreate
) => {
  return _fetch('/tx/makeunsignedtx', SplitAddrTx)
}
