// import bitcore from 'bitcore-lib'

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
