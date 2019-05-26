import UtilInterface from '../../util/interface'

namespace Response {
  export interface UnsignedContractTx extends UtilInterface.UnsignedTx {
    contractAddr: string
  }
}

export default Response
