namespace Request {
  export interface SplitAddrTxReq {
    from: string
    addrs: string[]
    weights: number[]
    fee: string
  }
}

export default Request
