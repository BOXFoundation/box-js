import "jest"
import fetch from "isomorphic-fetch"
import Mock from "../static/json/mock.json"
import Keystore from "../static/json/keystore.json"
import Api from "../package/boxd/core/api"
import Feature from "../package/boxd/core/feature"
import Util from "../package/boxd/util/util"

const api = new Api(fetch, Mock.endpoint_dev, "http")
const feature = new Feature(fetch, Mock.endpoint_dev, "http")
let token_hash

const sleep = seconds => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

jest.setTimeout(20000)

test("Issue a token & get the token balance", async done => {
  try {
    const issue_result = await feature.issueTokenByCrypto({
      tx: {
        issuer: Mock.acc_addr_2,
        owner: Mock.acc_addr_2,
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
    // console.log("[Issue a token] tx result :", issue_result)
    const tx_detail = await api.viewTxDetail(issue_result.hash)
    // console.log("[Issue a token] tx detail :", tx_detail)
    expect(tx_detail.detail.hash).toEqual(issue_result.hash)
    token_hash = issue_result.hash
    const token_addr = await Util.encodeTokenAddr({
      opHash: token_hash,
      index: 0
    })

    // test [TokenUtil.decodeTokenAddr]
    const { opHash, index } = await Util.decodeTokenAddr(token_addr)
    expect(opHash).toEqual(token_hash)
    expect(index).toEqual(0)

    // test [Api.getTokenbalances]
    setTimeout(async () => {
      const token_balances = await api.getTokenbalances({
        addrs: [Mock.acc_addr_2, Mock.acc_addr_2],
        tokenHash: token_hash,
        tokenIndex: 0
      })
      // console.log("[Issue a token] token balances:", token_balances)

      expect(
        Number(token_balances.balances[1]) / Math.pow(10, Mock.token_decimal)
      ).toEqual(Mock.token_supply)
      await sleep(2)
      done()
    }, 5000)
  } catch (err) {
    console.error("Issue a token & get the token balance Error :", err)
    expect(0).toBe(1)
  }
})

test("Make a token transaction", async () => {
  try {
    const param = {
      tx: {
        amounts: [1000, 2000],
        from: Mock.acc_addr_2,
        to: Mock.to_addrs,
        token_hash,
        token_index: 0
      },
      crypto: Keystore.keystore_2,
      pwd: Mock.acc_pwd
    }
    // console.log("[Token TX] param :", param)
    const token_result = await feature.makeTokenTxByCrypto(param)
    // console.log("[Token TX] result :", token_result)
    const token_detail = await api.viewTxDetail(token_result.hash)
    // console.log("[Token TX] detail:", token_detail)

    expect(token_detail.detail.hash).toEqual(token_result.hash)
  } catch (err) {
    console.error("Make a token transaction Error :", err)
    expect(0).toBe(1)
  }
})
