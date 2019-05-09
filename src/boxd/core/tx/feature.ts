import { getSignHash, signatureScript } from '../../util/util'
import { SignedTxByAccReq } from '../request'

namespace TX {
  /**
   * @export sign-Transaction-by-Account
   * @param [*acc] Account
   * @returns [promise]
   */
  export const signTransactionByAcc = async (unSignedTx: SignedTxByAccReq) => {
    let { acc, tx, rawMsgs: protoBufs } = unSignedTx
    for (let idx = 0; idx < tx.vin.length; idx++) {
      const sigHashBuf = getSignHash(protoBufs[idx])
      const signBuf = acc['signMsg'](sigHashBuf)
      const scriptSig = signatureScript(signBuf, acc.toPublicKey().toBuffer())
      tx.vin[idx].script_sig = scriptSig.toString('base64')
    }
    return tx
  }
}

export default TX
