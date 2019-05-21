import 'jest'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Data.endpoint_test, 'http')
const feature = new Feature(fetch, Data.endpoint_test, 'http')

test('Make a BOX Transaction', async () => {
  await cor
    .makeUnsignedTx({
      from: Data.acc_addr,
      to: Data.to_addrs,
      amounts: Data.amounts,
      fee: Data.fee
    })
    .then(async res => {
      // console.log('unsigned_tx:', JSON.stringify(res))
      const signed_tx = await cor.signTransactionByPrivKey({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        privKey: Data.acc_privateKey
      })
      const signed_tx_acc = await feature.signTransactionByKeystore({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        keystore: Keystore,
        pwd: Data.acc_pwd
      })
      // console.log('signed_tx:', JSON.stringify(signed_tx))
      const tx_result = await cor.sendTransaction(signed_tx)
      // console.log('tx_result:', tx_result)
      const tx_detail = await cor.viewTxDetail(tx_result.hash)
      // console.log('tx_detail:', JSON.stringify(tx_detail))
      expect(tx_detail.detail.hash).toEqual(tx_result.hash)
    })
    .catch(err => {
      console.error('Make a BOX Transaction Error:', err)
      expect(0).toBe(1)
    })
})

test('Get the BOX Balance of the given Address', async () => {
  await cor
    .getBalance(Data.acc_addr)
    .then(async res => {
      // console.log('getBalance res:', JSON.stringify(res))
      expect(res)
    })
    .catch(err => {
      console.log('getBalance Error:', err)
      expect(0).toBe(1)
    })
})

test('Get the BOX Balances of the given Addresses', async () => {
  await cor
    .getBalances([Data.acc_addr, Data.acc_addr])
    .then(async res => {
      expect(res)
    })
    .catch(err => {
      console.log('getBalances Error:', err)
      expect(0).toBe(1)
    })
})

// todo
/* test('Make a Raw Transaction', async () => {
  await cor
    .createRawTransaction({
      addr: Data.acc_addr,
      to: Data.to_map,
      fee: Data.fee,
      privKey: Data.acc_privateKey
    })
    .then(async res => {
      console.log('createRawTransaction res:', JSON.stringify(res))
      // expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('Make a Raw Transaction Error:', err)
      // expect(0).toBe(1)
    })
}) */
