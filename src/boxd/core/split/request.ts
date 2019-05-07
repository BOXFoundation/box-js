import bitcore from 'bitcore-lib'

export interface SplitCreate {
  from: bitcore.Address
  addrs: bitcore.Address[]
  weights: string[]
  fee: string
}
