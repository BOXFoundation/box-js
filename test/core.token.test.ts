import 'jest'
import fetch from 'isomorphic-fetch'
import { Core } from '../src/boxd/core/core'
import Data from './json/data.json'
/* import { encodeTokenAddr, decodeTokenAddr } from '../src/boxd/core/token/token'

const Data = require('./json/data.json')

test('Encode Token Address', async () => {
  // test func [encodeTokenAddr]
  const token_addr = await encodeTokenAddr(Data.token_hash, Data.token_index)
  expect(token_addr).toEqual(Data.token_addr)
})

test('Decode Token Address', async () => {
  // test func [decodeTokenAddr]
  const { opHash, index } = await decodeTokenAddr(Data.token_addr)
  expect(opHash).toEqual(Data.token_hash)
  expect(index).toEqual(Data.token_index)
}) */

const cor = new Core(fetch, Data.endpoint_1)

test('Issue a Token', async () => {
  // test func [Core.makeUnsignedTokenIssueTx]
  await cor
    .makeUnsignedTokenIssueTx({
      issuer: Data.acc_addr_1,
      owner: Data.acc_addr_1,
      fee: Data.fee,
      tag: {
        name: Data.token_name,
        symbol: Data.token_symbol,
        supply: Data.token_supply,
        decimal: Data.token_decimal
      }
    })
    .then(async res => {
      console.log('res:', JSON.stringify(res))
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
    })
    .catch(err => {
      console.error('Issue a Token Error:', err)
      expect(0).toBe(1)
    })
})
