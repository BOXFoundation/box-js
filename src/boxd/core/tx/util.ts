import CommonUtil from '../../util/util'
import Request from '../request'

namespace TX {
  /**
   * @export sign-Transaction-by-Account
   * @param [*acc] Account
   * @returns [promise]
   */
  export const signTransactionByAcc = async (
    unSignedTx: Request.SignedTxByAccReq
  ) => {
    let { acc, tx, rawMsgs: protoBufs } = unSignedTx
    for (let idx = 0; idx < tx.vin.length; idx++) {
      const sigHashBuf = CommonUtil.getSignHash(protoBufs[idx])
      const signBuf = acc['signMsg'](sigHashBuf)
      const scriptSig = CommonUtil.signatureScript(
        signBuf,
        acc.toPublicKey().toBuffer()
      )
      tx.vin[idx].script_sig = scriptSig.toString('base64')
    }
    return tx
  }
}

export default TX
