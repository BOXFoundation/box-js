import "jest"
import fetch from "isomorphic-fetch"
import Mock from "../static/json/mock.json"
import Api from "../package/boxd/core/api"

let node_id
const api = new Api(fetch, Mock.endpoint_dev, "http")

test("Get node info [Admin]", async () => {
  try {
    const node_info = await api.getNodeInfo()
    console.log("node_info :", JSON.stringify(node_info))
    node_id = node_info.nodes[0].id
    console.log("node_id :", node_id)
    expect(node_id)
  } catch (err) {
    console.error("Get node info [Admin] Error :", err)
    expect(0).toBe(1)
  }
})

test("Get block hash by Height", async () => {
  try {
    expect(await api.getBlockHashByHeight(Mock.block_height))
  } catch (err) {
    console.error("Get block hash by Height Error :", err)
    expect(0).toBe(1)
  }
})

test("View block detail by [hash / height]", async () => {
  try {
    expect(await api.viewBlockDetail("block_hash", Mock.block_hash))
    expect(await api.viewBlockDetail("block_height", Mock.block_height))
  } catch (err) {
    console.error("View block detail by [hash / height] Error :", err)
    expect(0).toBe(1)
  }
})

test("Get block header by [hash / height]", async () => {
  try {
    expect(await api.getBlockHeader("block_hash", Mock.block_hash))
    expect(await api.getBlockHeader("block_height", Mock.block_height))
  } catch (err) {
    console.error("Get block header by [hash / height] Error :", err)
    expect(0).toBe(1)
  }
})

test("Get current block height", async () => {
  try {
    expect(await api.getCurrentBlockHeight())
  } catch (err) {
    console.error("Get current block height Error :", err)
    expect(0).toBe(1)
  }
})
