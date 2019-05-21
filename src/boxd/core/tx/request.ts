import UtilInterface from '../../util/interface'
import Response from './response'

namespace Request {
  export interface AddrsMap {
    [to_addr: string]: number
  }

  export interface Raw {
    addr: string
    to: AddrsMap
    fee: string
    privKey: string
  }

  export interface OriginalTxReq {
    from: string
    to: string[]
    amounts: number[]
    fee: string
  }

  export interface SignedTxByKeysReq {
    unsignedTx: {
      tx: Response.TX
      rawMsgs: string[]
    }
    keystore: UtilInterface.Keystore
    pwd: string
  }

  export interface SetchUtxosReq {
    addr: string
    amount: number
  }

  export interface MakeBoxTxByKeysReq {
    tx: OriginalTxReq
    keystore: UtilInterface.Keystore
    pwd: string
  }
}

export default Request
