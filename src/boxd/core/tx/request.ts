import bitcore from 'bitcore-lib'

export interface TX {
  from: bitcore.Address
  to: bitcore.Address[]
  amounts: string[]
  fee: string
}
