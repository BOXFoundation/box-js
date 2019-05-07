import bitcore from 'bitcore-lib'

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
  issuer: bitcore.Address
  owner: bitcore.Address
  tag: string
  fee: string
}

export interface TokenTransferTx {
  token_hash: string
  token_index: number
  from: bitcore.Address
  to: bitcore.Address[]
  amounts: string[]
  fee: string
}
