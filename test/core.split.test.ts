import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'

const cor = new Api(fetch, Data.endpoint_test, 'http')

test('Make Unsigned Split Address Transaction', async () => {
  // test func [Api.makeUnsignedSplitAddrTx]
  await cor
    .makeUnsignedSplitAddrTx({
      from: Data.acc_addr_1,
      addrs: Data.to_addrs,
      weights: Data.split_weights,
      fee: Data.fee
    })
    .then(res => {
      // console.log('makeUnsignedSplitAddrTx:', JSON.stringify(res))
      expect(res.splitAddr).toEqual('b2MCXkq7qRzBunNGCdiqL1mZSpUSNqdWYqP')
    })
    .catch(err => {
      console.error('makeUnsignedSplitAddrTx err:', err)
      expect(0).toBe(1)
    })
})
