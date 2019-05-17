import 'jest'
import Core from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
import SplitResponse from '../src/boxd/core/split/response'

const cor = new Core(fetch, Data.endpoint_test, 'http')

test('Make Unsigned Split Address Transaction', async () => {
  // test func [Core.makeUnsignedSplitAddrTx]
  await cor
    .makeUnsignedSplitAddrTx({
      from: Data.acc_addr,
      addrs: Data.to_addrs,
      weights: Data.split_weights,
      fee: Data.fee
    })
    .then((res: SplitResponse.UnsignedSplitAddrTx) => {
      expect(res.code).toEqual(0)
      expect(res.splitAddr).toEqual('b2MCXkq7qRzBunNGCdiqL1mZSpUSNqdWYqP')
    })
    .catch(err => {
      console.error('makeUnsignedSplitAddrTx err:', err)
    })
})
