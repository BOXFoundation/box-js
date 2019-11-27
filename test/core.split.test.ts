import "jest"
import fetch from "isomorphic-fetch"
import Mock from "../static/json/mock.json"
import Keystore from "../static/json/keystore.json"
import Api from "../package/boxd/core/api"
import Feature from "../package/boxd/core/feature"

const api = new Api(fetch, Mock.endpoint_dev, "http")
const feature = new Feature(fetch, Mock.endpoint_dev, "http")

test("Make a split contract transaction", async () => {
  try {
    const tx_result = await feature.makeSplitTxByCrypto({
      tx: {
        from: Mock.acc_addr_1,
        addrs: Mock.to_addrs,
        weights: Mock.split_weights
      },
      crypto: Keystore.keystore_1,
      pwd: Mock.acc_pwd
    })
    const tx_detail = await api.viewTxDetail(tx_result.hash)

    expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  } catch (err) {
    console.error("Make a split contract transaction Error :", err)
    expect(0).toBe(1)
  }
})
