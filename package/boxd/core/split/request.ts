import UtilInterface from '../../util/interface'

namespace Request {
  export interface SplitAddrTxReq {
    from: string;
    addrs: string[];
    weights: number[];
    fee: string;
  }

  export interface MakeSplitTxByCryptoReq {
    tx: SplitAddrTxReq;
    crypto: UtilInterface.Crypto;
    pwd: string;
  }
  export interface CalcSplitAddrReq {
    addrs: string[];
    weights: number[];
    txHash: string;
    index: number;
  }
}

export default Request
