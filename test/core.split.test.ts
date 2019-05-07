import 'jest'
import fetch from 'isomorphic-fetch'
import Core from '../src/boxd/core/core'

import Data from './json/data.json'
const cor = new Core(Data.endpoint, fetch)

test('Make Unsigned Split Address Tx', async () => {
  // test func [Core.makeUnsignedSplitAddrTx]
  const resssssss = await cor.makeUnsignedSplitAddrTx({
    from: Data.split_from,
    addrs: Data.split_addrs,
    weights: Data.split_weights,
    fee: Data.split_fee
  })
  console.log('resssssss:', resssssss)
  // expect(token_addr).toEqual(Data.token_addr)
})
