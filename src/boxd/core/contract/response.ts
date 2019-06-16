import UtilInterface from '../../util/interface'

namespace Response {
  export interface UnsignedContractTx extends UtilInterface.UnsignedTx {
    // only valid for contract deployment
    contract_addr: string
  }

  export interface CallContractResp {
    output: string
  }
}

export default Response
