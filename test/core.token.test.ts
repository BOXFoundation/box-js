import 'jest'
import fetch from 'isomorphic-fetch'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import TokenUtil from '../src/boxd/core/token/util'
import Mock from './json/mock.json'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Mock.endpoint_dev, 'http')
const feature = new Feature(fetch, Mock.endpoint_dev, 'http')
let token_hash

jest.setTimeout(15000)

test('Issue a token & get the token balance', async done => {
  try {
    const issue_result = await feature.issueTokenByCrypto({
      tx: {
        issuer: Mock.acc_addr_2,
        owner: Mock.acc_addr_2,
        fee: Mock.fee,
        tag: {
          name: Mock.token_name,
          symbol: Mock.token_symbol,
          supply: Mock.token_supply,
          decimal: Mock.token_decimal
        }
      },
      crypto: Keystore.keystore_2,
      pwd: Mock.acc_pwd
    })
    // console.log('tx_result :', issue_result)
    const tx_detail = await cor.viewTxDetail(issue_result.hash)
    // console.log('tx_detail :', tx_detail)
    expect(tx_detail.detail.hash).toEqual(issue_result.hash)
    // console.log('issue_result :', issue_result)
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
        addrs: [Mock.acc_addr_2, Mock.acc_addr_2],
        tokenHash: token_hash,
        tokenIndex: 0
      })
      console.log('token_balances:', token_balances)
      expect(
        Number(token_balances.balances[1]) / Math.pow(10, Mock.token_decimal)
      ).toEqual(Mock.token_supply)
      done()
    }, 2000)
  } catch (err) {
    console.error('Issue a token & get the token balance Error :', err)
    expect(0).toBe(1)
  }
  setTimeout(async () => {
    done()
  }, 10000)
})

test('Make a token transaction', async () => {
  try {
    const param = {
      tx: {
        amounts: Mock.amounts,
        fee: Mock.fee,
        from: Mock.acc_addr_2,
        to: Mock.to_addrs,
        token_hash,
        token_index: 0
      },
      crypto: Keystore.keystore_2,
      pwd: Mock.acc_pwd
    }
    console.log('param :', param)
    const token_result = await feature.makeTokenTxByCrypto(param)
    const token_detail = await cor.viewTxDetail(token_result.hash)
    // console.log('token_detail:', token_detail)
    expect(token_detail.detail.hash).toEqual(token_result.hash)
  } catch (err) {
    console.error('Make a token transaction Error :', err)
    expect(0).toBe(1)
  }
})
