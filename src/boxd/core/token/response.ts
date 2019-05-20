namespace Response {
  interface IssueVin {
    prev_out_point: {
      hash: string
      index: number
    }
    script_sig?: any
    sequence: number
  }

  interface IssueVout {
    value: string
    script_pub_key: string
  }

  interface TokenTx {
    version: number
    vin: IssueVin[]
    vout: IssueVout[]
    data?: any
    magic: number
    lock_time: string
  }

  export interface UnsignedTokenIssueTx {
    issue_out_index: number
    tx: TokenTx
    rawMsgs: string[]
  }

  export interface UnsignedTokenTx {
    tx: TokenTx
    rawMsgs: string[]
  }
}

export default Response
