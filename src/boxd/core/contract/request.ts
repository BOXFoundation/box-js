import Response from './response'

namespace Request {
  export interface ContractDeployReq {
    from: string,
    bytecode: string,
    gasLimit: number,
    gasPrice: number
  }

  export interface ContractCallReq {
    from: string,
    contractAddr:   string,
    methodAbi: string,
    gasLimit: number,
    gasPrice: number
  }
}

export default Request
