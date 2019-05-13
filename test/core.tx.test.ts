import 'jest'
import { Core } from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
import Response from '../src/boxd/core/response'

const cor = new Core(fetch, Data.endpoint_1)

test('Make a BOX Transaction', async () => {
  // test func [Core.makeUnsignedTx]
  await cor
    .makeUnsignedTx({
      from: Data.acc_addr_1,
      to: Data.to_addrs,
      amounts: Data.amounts,
      fee: Data.fee
    })
    .then(async (res: Response.UnsignedTx) => {
      // console.log('unsigned_tx:', JSON.stringify(res))
      expect(res.code).toEqual(0)
      // test func [Core.signTransactionByPrivKey]
      const signed_tx = await cor.signTransactionByPrivKey({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        privKey: Data.acc_privateKey_1
      })
      // console.log('signed_tx:', JSON.stringify(signed_tx))
      // test func [Core.sendTransaction]
      const tx_result = await cor.sendTransaction(signed_tx)
      // console.log('tx_result:', tx_result)
      expect(tx_result.code).toEqual(0)
      // todo test func [Core.signTransactionByAcc]
      const tx_detail = await cor.viewTxDetail(tx_result.hash)
      // console.log('tx_detail:', tx_detail)
      expect(tx_detail.code).toEqual(0)
      expect(tx_detail.detail.hash).toEqual(tx_result.hash)
    })
    .catch(err => {
      console.error('Make a BOX Transaction Error:', err)
      expect(0).toBe(1)
    })
})

test('Get the BOX Balance of the given Address', async () => {
  // test func [Core.getBalance]
  await cor
    .getBalance(Data.acc_addr_1)
    .then(async res => {
      // console.log('getBalance res:', JSON.stringify(res))
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.log('getBalance Error:', err)
      expect(0).toBe(1)
    })
})

test('Get the BOX Balances of the given Addresses', async () => {
  // test func [Core.getBalances]
  await cor
    .getBalances([Data.acc_addr, Data.acc_addr_1])
    .then(async res => {
      // console.log('getBalances res:', JSON.stringify(res))
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.log('getBalances Error:', err)
      expect(0).toBe(1)
    })
})
