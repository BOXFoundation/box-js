import UtilInterface from '../../util/interface'

namespace Response {
    export interface UnsignedTokenIssueTx extends UtilInterface.UnsignedTx {
        issue_out_index: number;
    }
}

export default Response
