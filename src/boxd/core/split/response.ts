namespace Response {
  export interface UnsignedSplitAddrTx {
    splitAddr: string
    rawMsgs: string[]
    tx: {
      version: number
      vin: object[]
      vout: object[]
      data?: any
      magic: number
      lock_time: string
    }
  }
}

export default Response
