import { SplitCreate } from './request'
import { fetch } from '../../util/util'

/**
 * @export make-Unsigned-Split-Address-Tx
 * @param [*split_addr_tx] SplitAddrTx
 * @returns [response]
 */
export const makeUnsignedSplitAddrTx = async (
  _fetch: any,
  endpoint: string,
  split_addr_tx: SplitCreate
) => {
  return await fetch(_fetch, endpoint, '/tx/makeunsignedtx', split_addr_tx)
}
