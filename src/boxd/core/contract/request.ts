import UtilInterface from '../../util/interface'

namespace Request {
  interface Topiclist {}

  export interface OriginalContractReq {
    from: string;
    to: string;
    amount: number;
    gasPrice: number;
    gasLimit: number;
    nonce: number;
    isDeploy: boolean;
    data: string;
  }

  export interface CallContractReq {
    from: string;
    to: string;
    data: string;
    height: number;
    timeout: number;
  }

  export interface ContractTxByCryptoReq {
    tx: OriginalContractReq;
    crypto: UtilInterface.Crypto;
    pwd: string;
  }

  export interface GetLogsReq {
    hash: string;
    from: number;
    to: number;
    addresses: string[];
    topics: string[][];
  }
}

export default Request
