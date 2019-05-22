import 'jest'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Data.endpoint_test, 'http')
const feature = new Feature(fetch, Data.endpoint_test, 'http')

test('Make a BOX Transaction', async () => {
  const tx_result = await feature.makeBoxTxByCrypto({
    tx: {
      from: Data.acc_addr,
      to: Data.to_addrs,
      amounts: Data.amounts,
      fee: Data.fee
    },
    crypto: Keystore,
    pwd: Data.acc_pwd
  })
  const tx_detail = await cor.viewTxDetail(tx_result.hash)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
})

/* test('Sign Transaction by PrivKey or Crypto', async () => {
  await cor
    .makeUnsignedTx({
      from: Data.acc_addr,
      to: Data.to_addrs,
      amounts: Data.amounts,
      fee: Data.fee
    })
    .then(async res => {
      // console.log('unsigned_tx:', JSON.stringify(res))
      const signed_tx = await cor.signTransactionByCrypto({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        privKey: Data.acc_privateKey
      })
      const signed_tx_acc = await feature.signTransactionByCrypto({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        crypto: Keystore,
        pwd: Data.acc_pwd
      })
      expect(signed_tx).toEqual(signed_tx_acc)
    })
    .catch(err => {
      console.error('Sign Transaction by PrivKey or Crypto Error:', err)
      expect(0).toBe(1)
    })
}) */

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
