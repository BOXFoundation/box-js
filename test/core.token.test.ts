import 'jest'
import fetch from 'isomorphic-fetch'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import TokenUtil from '../src/boxd/core/token/util'
import Data from './json/data.json'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Data.endpoint_test, 'http')
const feature = new Feature(fetch, Data.endpoint_test, 'http')
let token_hash

test('Issue a Token and get the Token Balance', async done => {
  try {
    const issue_result = await feature.issueTokenByCrypto({
      tx: {
        issuer: Data.acc_addr_2,
        owner: Data.acc_addr_2,
        fee: Data.fee,
        tag: {
          name: Data.token_name,
          symbol: Data.token_symbol,
          supply: Data.token_supply,
          decimal: Data.token_decimal
        }
      },
      crypto: Keystore.keystore_2,
      pwd: Data.acc_pwd
    })
    // console.log('tx_result:', issue_result)
    const tx_detail = await cor.viewTxDetail(issue_result.hash)
    // console.log('tx_detail:', tx_detail)
    expect(tx_detail.detail.hash).toEqual(issue_result.hash)
    // console.log('issue_result:', issue_result)
    token_hash = issue_result.hash
    const token_addr = await TokenUtil.encodeTokenAddr({
      opHash: token_hash,
      index: 0
    })
    // test func [TokenUtil.decodeTokenAddr]
    const { opHash, index } = await TokenUtil.decodeTokenAddr(token_addr)
    expect(opHash).toEqual(token_hash)
    expect(index).toEqual(0)
    // test func [Core.getTokenbalances]
    setTimeout(async () => {
      const token_balances = await cor.getTokenbalances({
        addrs: [Data.acc_addr_2, Data.acc_addr_2],
        tokenHash: token_hash,
        tokenIndex: 0
      })
      // console.log('token_balances:', token_balances)
      expect(
        Number(token_balances.balances[1]) / Math.pow(10, Data.token_decimal)
      ).toEqual(Data.token_supply)
      done()
    }, 3000)
  } catch (err) {
    console.error('Issue a Token and get the Token Balance Error:', err)
    expect(0).toBe(1)
  }
})

test('Make a Token Transaction', async () => {
  try {
    const token_result = await feature.makeTokenTxByCrypto({
      tx: {
        amounts: Data.amounts,
        fee: Data.fee,
        from: Data.acc_addr_2,
        to: Data.to_addrs,
        token_hash: token_hash,
        token_index: 0
      },
      crypto: Keystore.keystore_2,
      pwd: Data.acc_pwd
    })
    const token_detail = await cor.viewTxDetail(token_result.hash)
    // console.log('token_detail:', token_detail)
    expect(token_detail.detail.hash).toEqual(token_result.hash)
  } catch (err) {
    console.error('Make a Token Transaction Error:', err)
    expect(0).toBe(1)
  }
})
