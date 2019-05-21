import 'jest'
import fetch from 'isomorphic-fetch'
import Api from '../src/boxd/core/api'
import TokenUtil from '../src/boxd/core/token/util'
import Data from './json/data.json'

const cor = new Api(fetch, Data.endpoint_test, 'http')
let token_hash

test('Issue a Token and get the Token Balance', async done => {
  // test func [Api.makeUnsignedTokenIssueTx]
  await cor
    .makeUnsignedTokenIssueTx({
      issuer: Data.acc_addr,
      owner: Data.acc_addr,
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
      // test func [Api.signTransactionByPrivKey]
      const signed_token = await cor.signTransactionByPrivKey({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        privKey: Data.acc_privateKey
      })
      // console.log('signed_token:', JSON.stringify(signed_token))
      // test func [Api.sendTransaction]
      const issue_result = await cor.sendTransaction(signed_token)
      // console.log('issue_result:', issue_result)
      token_hash = issue_result.hash
      // test func [TokenUtil.encodeTokenAddr]
      const token_addr = await TokenUtil.encodeTokenAddr({
        opHash: token_hash,
        index: 0
      })
      // test func [TokenUtil.decodeTokenAddr]
      const { opHash, index } = await TokenUtil.decodeTokenAddr(token_addr)
      expect(opHash).toEqual(token_hash)
      expect(index).toEqual(0)
      setTimeout(async () => {
        const token_balances = await cor.getTokenbalances({
          addrs: [Data.acc_addr, Data.acc_addr],
          tokenHash: token_hash,
          tokenIndex: 0
        })
        // console.log('token_balances:', token_balances)
        expect(
          Number(token_balances.balances[1]) / Math.pow(10, Data.token_decimal)
        ).toEqual(Data.token_supply)
        done()
      }, 3000)
    })
    .catch(err => {
      console.error('Issue a Token and get the Token Balance Error:', err)
      expect(0).toBe(1)
    })
})

test('Make a Token Transaction', async () => {
  // test func [Api.makeUnsignedTokenTransferTx]
  await cor
    .makeUnsignedTokenTransferTx({
      amounts: Data.amounts,
      fee: Data.fee,
      from: Data.acc_addr,
      to: Data.to_addrs,
      token_hash: token_hash,
      token_index: 0
    })
    .then(async res => {
      // console.log('unsigned_Token:', JSON.stringify(res))

      // test func [Api.signTransactionByPrivKey]
      const signed_Token = await cor.signTransactionByPrivKey({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        privKey: Data.acc_privateKey
      })
      // console.log('signed_Token:', JSON.stringify(signed_Token))
      // test func [Api.sendTransaction]
      const token_result = await cor.sendTransaction(signed_Token)
      const token_detail = await cor.viewTxDetail(token_result.hash)
      // console.log('token_detail:', token_detail)
      expect(token_detail.detail.hash).toEqual(token_result.hash)
    })
    .catch(err => {
      console.error('Make a Token Transaction Error:', err)
      expect(0).toBe(1)
    })
})
