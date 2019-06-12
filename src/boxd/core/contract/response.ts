import UtilInterface from '../../util/interface'

namespace Response {
  export interface UnsignedContractTx extends UtilInterface.UnsignedTx {
    // only valid for contract deployment
    contractAddr: string,
    // only valid for contract method call
    callResult: string,
  }
}

export default Response
