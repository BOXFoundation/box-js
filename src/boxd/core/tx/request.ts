import bitcore from 'bitcore-lib'

export interface TX {
  from: bitcore.Address
  to: bitcore.Address[]
  amounts: string[]
  fee: string
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
