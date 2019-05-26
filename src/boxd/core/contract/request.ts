import UtilInterface from '../../util/interface'

namespace Request {
  export interface OriginalContractReq {
    from: string,
    to: string,
    amount: number,
    gasPrice: number,
    gasLimit: number,
    nonce: number,
    isDeploy: boolean,
    data: string
  }

  
  export interface ContractTxByCryptoReq {
    tx: OriginalContractReq
    crypto: UtilInterface.Crypto
    pwd: string
  }
}

export default Request
