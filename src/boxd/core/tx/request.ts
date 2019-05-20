import bitcore from 'bitcore-lib'
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

  export interface SignedTxByAccReq {
    acc: bitcore.PrivateKey
    tx: Response.TX
    rawMsgs: string[]
  }

  export interface SetchUtxosReq {
    addr: string
    amount: number
  }
}

export default Request
