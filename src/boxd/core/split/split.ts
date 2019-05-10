import { SplitAddrTxReq } from '../request'

namespace Split {
  /**
   * @export make-Unsigned-Split-Address-Tx
   * @param [*split_addr_tx] SplitAddrTxReq
   * @returns [promise] UnsignedSplitAddrTx
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
}
export default Split
