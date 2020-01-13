import UtilInterface from "../../util/interface"
import TxResponse from "./response"

namespace Request {
  interface AddrsMap {
    [to_addr: string]: number
  }

  export interface Raw {
    addr: string
    to: AddrsMap
    privKey: string
  }

  export interface OriginalTxReq {
    from: string
    to: string[]
    amounts: number[]
  }

  export interface SignedTxByCryptoReq {
    unsignedTx: UtilInterface.UnsignedTx
    crypto: UtilInterface.Crypto
    pwd: string
  }

  export interface FetchUtxosReq {
    addr: string
    amount
  }

  export interface MakeBoxTxByCryptoReq {
    tx: OriginalTxReq
    crypto: UtilInterface.Crypto
    pwd: string
  }

  export interface MakeUnsignTxReq {
    from: string
    to_map: AddrsMap
    utxo_list: TxResponse.Utxo[]
    is_raw?: boolean
  }

  export interface FaucetInfoReq {
    addr: string
    amount: number
  }
}

export default Request
