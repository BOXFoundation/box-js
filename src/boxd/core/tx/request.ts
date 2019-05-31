import UtilInterface from '../../util/interface'

namespace Request {
    interface AddrsMap {
        [to_addr: string]: number;
    }

    export interface Raw {
        addr: string;
        to: AddrsMap;
        fee: string;
        privKey: string;
    }

    export interface OriginalTxReq {
        from: string;
        to: string[];
        amounts: number[];
        fee: string;
    }

    export interface SignedTxByCryptoReq {
        unsignedTx: UtilInterface.UnsignedTx;
        crypto: UtilInterface.Crypto;
        pwd: string;
    }

    export interface SetchUtxosReq {
        addr: string;
        amount: number;
    }

    export interface MakeBoxTxByCryptoReq {
        tx: OriginalTxReq;
        crypto: UtilInterface.Crypto;
        pwd: string;
    }
}

export default Request
