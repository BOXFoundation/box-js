import 'jest'
import fetch from 'isomorphic-fetch'
import { Core } from '../src/boxd/core/core'
// import TokenUtil from '../src/boxd/core/token/util'
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

test('Issue a Token and get the Token Balance', async done => {
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
      // console.log('unsign_token:', JSON.stringify(res))
      expect(res.code).toEqual(0)
      // test func [Core.signTransactionByPrivKey]
      const signed_token = await cor.signTransactionByPrivKey({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        privKey: Data.acc_privateKey_1
      })
      // console.log('signed_token:', JSON.stringify(signed_token))
      // test func [Core.sendTransaction]
      const issue_result = await cor.sendTransaction(signed_token)
      console.log('issue_result:', issue_result)
      expect(issue_result.code).toEqual(0)
      /*       const { opHash, index } = await TokenUtil.decodeTokenAddr(
        issue_result.hash
      )
      const token_addr = await TokenUtil.encodeTokenAddr({ opHash, index })
      expect(token_addr).toEqual(issue_result.hash) */
      setTimeout(async () => {
        const token_balance = await cor.getTokenbalance({
          addr: Data.acc_addr_1,
          tokenHash: issue_result.hash,
          tokenIndex: 0
        })
        console.log('token_balance:', token_balance)
        expect(token_balance.code).toEqual(0)
        expect(token_balance).toEqual(Data.token_supply)
        done()
      }, 10000)
    })
    .catch(err => {
      console.error('Issue a Token Error:', err)
      expect(0).toBe(1)
    })
})
