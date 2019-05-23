import UtilInterface from '../../util/interface'

namespace Request {
  export interface SplitAddrTxReq {
    from: string
    addrs: string[]
    weights: number[]
    fee: string
  }

  export interface MakeSplitTxByKeysReq {
    tx: SplitAddrTxReq
    crypto: UtilInterface.Crypto
    pwd: string
  }
}

export default Request
