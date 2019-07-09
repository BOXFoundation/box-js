namespace Interface {
  // TX.Vin
  interface Vin {
    prev_out_point: {
      hash: string;
      index: number;
    };
    script_sig: string;
    sequence?: number;
  }

  // TX.Vout
  interface Vout {
    script_pub_key: string;
    value: string;
  }

  // crypto json
  export interface Crypto {
    id: string;
    address: string;
    crypto: {
      ciphertext: string;
      cipher: string;
      cipherparams: {
        iv: string;
      };
      mac: string;
      kdfparams: {
        salt: string;
        dklen: number;
        n: number;
        r: number;
        p: number;
      };
    };
  }

  // account-manager: Account
  export interface Account {
    cryptoJSON: Crypto;
    updateTime: number;
    P2PKH: string;
    name: string;
  }

  // TX or Block Detail.Vin

  export interface DetailVin {
    prev_out_detail: {
      addr: string;
      value: string;
      script_pub_key: string;
      script_disasm: string;
      type: string;
    };
    script_sig: string;
    sequence: number;
    prev_out_point: string;
  }

  // TX
  export interface TX {
    data?: any;
    lock_time: string;
    magic: number;
    version: number;
    vin: Vin[];
    vout: Vout[];
  }

  // TX or Block Detail.Vout
  export interface DetailVout {
    addr: string;
    value: string;
    script_pub_key: string;
    script_disasm: string;
    type: string;
  }

  // TX /Token /Split UnsignedTx

  export interface UnsignedTx {
    tx: TX;
    rawMsgs: string[];
  }

  export interface SignedTxByPrivKeyReq {
    unsignedTx: UnsignedTx;
    privKey: string;
  }
}

export default Interface
