import 'jest'
import fetch from 'isomorphic-fetch'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import Mock from './json/mock.json'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Mock.endpoint_test, 'http')
const feature = new Feature(fetch, Mock.endpoint_test, 'http')

test('Make a BOX transaction', async () => {
  try {
    const tx_result = await feature.makeBoxTxByCrypto({
      tx: {
        from: Mock.acc_addr_3,
        to: Mock.to_addrs,
        amounts: Mock.amounts,
        fee: Mock.fee
      },
      crypto: Keystore.keystore_3,
      pwd: Mock.acc_pwd
    })
    const tx_detail = await cor.viewTxDetail(tx_result.hash)
    expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  } catch (err) {
    console.error('Make a BOX transaction: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get the BOX balance of the given address', async () => {
  try {
    const box_balance = await cor.getBalance(Mock.acc_addr_3)
    expect(box_balance)
  } catch (err) {
    console.error('Get the BOX balance of the given address: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get the BOX balances of the given addresses', async () => {
  try {
    const box_balance = await cor.getBalances([
      Mock.acc_addr_3,
      Mock.acc_addr_3
    ])
    expect(box_balance)
  } catch (err) {
    console.error('Dump cryptoJson from privateKey: Error !', err)
    expect(0).toBe(1)
  }
})

/* test('faucet', async () => {
  try {
    const faucet_res = await cor.faucet({
      addr: Mock.acc_addr_2,
      amount: 30000000000
    })
    console.log('faucet res:', faucet_res)
  } catch (err) {
    console.error('faucet: Error !', err)
    expect(0).toBe(1)
  }
}) */

/* test('Sign transaction by privKey or crypto', async () => {
  try {
    const unsigned_tx = await cor.makeUnsignedTx({
      from: Mock.acc_addr_3,
      to: Mock.to_addrs,
      amounts: Mock.amounts,
      fee: Mock.fee
    })
    // console.log('unsigned_tx:', JSON.stringify(unsigned_tx))
    const signed_tx = await cor.signTxByPrivKey({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      privKey: Mock.acc_privateKey_3
    })
    // console.log('signed_tx:', JSON.stringify(signed_tx))
    const signed_tx_by_crypto = await feature.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: Keystore.keystore_3,
      pwd: Mock.acc_pwd
    })
    // console.log('signed_tx_by_crypto:', JSON.stringify(signed_tx_by_crypto))
    expect(signed_tx).toEqual(signed_tx_by_crypto)
  } catch (err) {
    console.error('Sign transaction by privKey or crypto: Error !', err)
    expect(0).toBe(1)
  }
}) */

// TODO
/* test('Make a raw transaction', async () => {
  try {
    const created_tx = await cor.createRawTx({
      addr: Mock.acc_addr_3,
      to: Mock.to_map,
      fee: Mock.fee,
      privKey: Mock.acc_privateKey_3
    })
    expect(created_tx)
    console.log('created_tx:', JSON.stringify(created_tx))
  } catch (err) {
    console.error('Make a raw transaction: Error !', err)
    expect(0).toBe(1)
  }
}) */
