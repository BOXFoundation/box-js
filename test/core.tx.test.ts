import 'jest'
import { Core } from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
import Response from '../src/boxd/core/response'

const cor = new Core(fetch, Data.endpoint)

test('Make Unsigned Transaction', async () => {
  // test func [Core.makeUnsignedTx]
  await cor
    .makeUnsignedTx({
      from: Data.acc_addr_1,
      to: Data.to_addrs,
      amounts: Data.amounts,
      fee: Data.fee
    })
    .then((res: Response.UnsignedTx) => {
      console.log('makeUnsignedTx res:', res)
      expect(res.code).toEqual(0)
      expect(res.rawMsgs).toEqual(Data.rawMsgs)
    })
    .catch(err => {
      console.error('makeUnsignedTx err:', err)
    })
})
