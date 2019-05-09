import bitcore from 'bitcore-lib'
import Response from './response'

// Split
export interface SplitAddrTxReq {
  from: string
  addrs: string[]
  weights: number[]
  fee: string
}

// Token
export interface TokenBalance {
  addr: string
  tokenHash: string
  tokenIndex: number
}

export interface TokenBalances {
  addrs: string[]
  tokenHash: string
  tokenIndex: number
}

export interface TokenIssueTx {
  issuer: string
  owner: string
  tag: string
  fee: string
}

export interface TokenTransferTx {
  token_hash: string
  token_index: number
  from: string
  to: string[]
  amounts: string[]
  fee: string
}

// TX
export interface UnsignedTxReq {
  from: string
  to: string[]
  amounts: string[]
  fee: string
}

export interface SignedTxByAccReq {
  acc: bitcore.PrivateKey
  tx: Response.TX
  rawMsgs: string[]
}

export interface Raw {
  address: string
  to: string[]
  fee: string
  utxoList: string[]
}
export interface UnSignedTx {
  tx
  rawMsgs
}
