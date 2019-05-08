import 'jest'
import { Core } from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'

const cor = new Core(fetch, Data.endpoint)

test('Make Unsigned Split Address Tx', async () => {
  // test func [Core.makeUnsignedSplitAddrTx]
  await cor
    .makeUnsignedSplitAddrTx({
      from: Data.split_from,
      addrs: Data.split_addrs,
      weights: Data.split_weights,
      fee: Data.split_fee
    })
    .then(res => {
      console.log('makeUnsignedSplitAddrTx res:', res)
    })
    .catch(err => {
      console.error('makeUnsignedSplitAddrTx err:', err)
    })
  // expect(token_addr).toEqual(Data.token_addr)
})
