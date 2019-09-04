import UtilInterface from '../../util/interface'

namespace Response {
  export interface UnsignedContractTx extends UtilInterface.UnsignedTx {
    // only valid for contract deployment
    contract_addr: string;
  }

  export interface CallContractResp {
    output: string;
  }

  export interface LogDetail {
    address: Buffer;
    topics: Buffer[];
    data: Buffer;
    block_number: number;
    tx_hash: Buffer;
    tx_index: number;
    block_hash: Buffer;
    index: number;
    removed: boolean;
  }
}

export default Response
