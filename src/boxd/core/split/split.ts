import { SplitAddrTxReq } from '../request'
import { fetchRPC } from '../../util/rpc'

/**
 * @export make-Unsigned-Split-Address-Tx
 * @param [*split_addr_tx] SplitAddrTxReq
 * @returns [response]
 */
export const makeUnsignedSplitAddrTx = async (
  _fetch: any,
  endpoint: string,
  split_addr_tx: SplitAddrTxReq
) => {
  return await fetchRPC(
    _fetch,
    endpoint,
    '/tx/makeunsignedtx/splitaddr',
    split_addr_tx
  )
}
