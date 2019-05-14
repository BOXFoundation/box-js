// import bitcore from 'bitcore-lib'

namespace Response {
  // Split
  export interface UnsignedSplitAddrTx {
    code: number
    message: string
    splitAddr: string
    tx: {
      version: number
      vin: object[]
      vout: object[]
      data?: any
      magic: number
      lock_time: string
    }
    rawMsgs: string[]
  }

  // Block
  export interface BlockHeader {
    version: number
    prev_block_hash: string
    txs_root: string
    time_stamp: string
    magic: number
    period_hash: string
    candidates_hash: string
  }

  export interface IrreversibleInfo {
    hash: string
    signatures: []
  }

  export interface Block {
    header: BlockHeader
    txs: object[]
    height: number
    signature: string
    irreversible_info: IrreversibleInfo
  }

  // TX
  export interface Vin {
    prev_out_point: {
      hash: string
      index?: number
    }
    script_sig?: string
    sequence?: number
  }

  export interface Vout {
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
