import 'jest'
import { Core } from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
import { UnsignedSplitAddrTx } from '../src/boxd/core/response'

const cor = new Core(fetch, Data.endpoint)

test('Make Unsigned Split Address Tx', async () => {
  // test func [Core.makeUnsignedSplitAddrTx]
  await cor
    .makeUnsignedSplitAddrTx({
      from: Data.acc_addr_1,
      addrs: Data.split_addrs,
      weights: Data.split_weights,
      fee: Data.split_fee
    })
    .then((res: UnsignedSplitAddrTx) => {
      expect(res.code).toEqual(0)
      expect(res.message).toEqual('success')
      expect(res.splitAddr).toEqual('b2MCXkq7qRzBunNGCdiqL1mZSpUSNqdWYqP')
    })
    .catch(err => {
      console.error('makeUnsignedSplitAddrTx err:', err)
    })
})
