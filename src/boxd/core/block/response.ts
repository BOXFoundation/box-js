import UtilInterface from '../../util/interface'

namespace Response {
    export interface NodeInfo {
        nodes: {
            id: string;
            addrs: string[];
            ttl: string;
        }[];
    }

    export interface BlockHeader {
        version: number;
        prev_block_hash: string;
        txs_root: string;
        time_stamp: string;
        magic: number;
        period_hash: string;
        candidates_hash: string;
    }

    export interface Block {
        header: BlockHeader;
        txs: object[];
        height: number;
        signature: string;
        irreversible_info: {
            hash: string;
            signatures: [];
        };
    }

    export interface BlcokDetail {
        detail: {
            version: number;
            height: number;
            time_stamp: string;
            size: number;
            hash: string;
            prev_block_hash: string;
            coin_base: string;
            confirmed: boolean;
            signature: string;
            txs: [
                {
                    hash: string;
                    vin: UtilInterface.DetailVin[];
                    vout: UtilInterface.DetailVout[];
                }
            ];
        };
    }
}

export default Response
