import UtilInterface from '../../util/interface'

namespace Response {
    export interface TxDetail {
        version: number;
        block_time: string;
        block_height: number;
        status: string;
        detail: {
            hash: string;
            vin: UtilInterface.DetailVin[];
            vout: UtilInterface.DetailVout[];
        };
    }

    export interface Utxo {
        out_point: {
            hash: string;
            index: number;
        };
        tx_out: {
            value: string;
            script_pub_key: string;
        };
        block_height: number;
        is_coinbase: boolean;
        is_spent: boolean;
    }
}

export default Response
