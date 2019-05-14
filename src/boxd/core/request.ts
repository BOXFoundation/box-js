import bitcore from 'bitcore-lib'
import Response from './response'

namespace Request {
  // Split
  export interface SplitAddrTxReq {
    from: string
    addrs: string[]
    weights: number[]
    fee: string
  }

  // Token
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

  export interface OrgTokenTxReq {
    amounts: number[]
    fee: string
    from: string
    to: string[]
    token_hash: string
    token_index: number
  }

  // TX
  export interface Raw {
    addr: string
    to: string[]
    amount: number[]
    fee: string
    privKey: string
  }

  export interface OrgTxReq {
    from: string
    to: string[]
    amounts: number[]
    fee: string
  }

  export interface SignedTxByAccReq {
    acc: bitcore.PrivateKey
    tx: Response.TX
    rawMsgs: string[]
  }
  export interface SetchUtxosReq {
    addr: string
    amount: number
  }
}

export default Request
