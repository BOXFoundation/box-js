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

  interface DetailVin {
    prev_out_detail: {
      addr: string
      value: string
      script_pub_key: string
      script_disasm: string
      type: string
    }
    script_sig: string
    sequence: number
    prev_out_point: string
  }

  interface DetailVout {
    addr: string
    value: string
    script_pub_key: string
    script_disasm: string
    type: string
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
    tx: TX
    rawMsgs: string[]
  }

  export interface TxDetail {
    version: number
    block_time: string
    block_height: number
    status: string
    detail: {
      hash: string
      vin: DetailVin[]
      vout: DetailVout[]
    }
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
