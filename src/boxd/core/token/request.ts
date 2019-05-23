namespace Request {
  export interface TokenIssueTxReq {
    issuer: string
    owner: string
    tag: {
      decimal: number
      name: string
      supply: number
      symbol: string
    }
    fee: string
  }

  export interface OriginalTokenTxReq {
    amounts: number[]
    fee: string
    from: string
    to: string[]
    token_hash: string
    token_index: number
  }

  export interface TokenBalanceReq {
    addr: string
    tokenHash: string
    tokenIndex: number
  }

  export interface TokenBalancesReq {
    addrs: string[]
    tokenHash: string
    tokenIndex: number
  }
}

export default Request
