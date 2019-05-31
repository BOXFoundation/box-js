import UtilInterface from '../../util/interface'

namespace Response {
    export interface UnsignedSplitAddrTx extends UtilInterface.UnsignedTx {
        splitAddr: string;
    }
}

export default Response
