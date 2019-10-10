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
    data?;
    lock_time?: string;
    magic?: number;
    version?: number;
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
    rawMsgs;
  }

  export interface SignedTxByPrivKeyReq {
    unsignedTx: UnsignedTx;
    privKey: string;
    protocalTx;
  }

  interface LogsReq {
    hash: string;
    from: number;
    to: number;
    addresses: string[];
    topics: string[];
  }

  export interface RegisterReq {
    type: number;
    info?: {
      logs_req: LogsReq;
    };
  }

  interface BlockDetail {
    version: number;
    height: number;
    time_stamp: number;
    size: number;
    hash: string;
    prev_block_hash: string;
    coin_base: string;
    confirmed: boolean;
    signature: string;
    TxDetail: [];
  }

  interface LogDetail {
    address: string;
    topics: string[];
    data: string;
    block_number: number;
    tx_hash: string;
    tx_index: number;
    block_hash: string;
    index: number;
    removed: boolean;
  }

  export interface ListenedData {
    type: number;
    data?: {
      block: BlockDetail;
      logs: LogDetail[];
    };
  }
}

export default Interface
