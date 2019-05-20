namespace Response {
  interface Vin {
    prev_out_point: {
      hash: string
      index?: number
    }
    script_sig?: string
    sequence?: number
  }

  interface Vout {
    script_pub_key: string
    value: string
    index?: number
  }

  export interface TX {
    data?: any
    lock_time: string
    magic: number
    version: number
    vin: Vin[]
    vout: Vout[]
  }

  export interface UnsignedTx {
    code: number
    message: string
    tx: TX
    rawMsgs: string[]
  }

  export interface Utxo {
    out_point: {
      hash: string
      index: number
    }
    tx_out: {
      value: string
      script_pub_key: string
    }
    block_height: number
    is_coinbase: boolean
    is_spent: boolean
  }
}

export default Response
