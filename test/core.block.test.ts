import 'jest'
import fetch from 'isomorphic-fetch'
import Mock from './json/mock.json'
import Api from '../src/boxd/core/api'

let node_id
const api = new Api(fetch, Mock.endpoint_dev, 'http')

test('Get node info', async () => {
  try {
    const node_info = await api.getNodeInfo()
    // console.log('node_info :', JSON.stringify(node_info))
    node_id = node_info.nodes[0].id
    // console.log('node_id :', node_id)
    expect(node_id)
  } catch (err) {
    console.error('Get node info Error :', err)
    expect(0).toBe(1)
  }
})

test('Get block hash by Height', async () => {
  try {
    expect(await api.getBlockHashByHeight(Mock.blockHeight))
  } catch (err) {
    console.error('Get block hash by Height Error :', err)
    expect(0).toBe(1)
  }
})

test('Get block by Height', async () => {
  try {
    expect(await api.getBlockByHeight(Mock.blockHeight))
  } catch (err) {
    console.error('Get block by Height Error :', err)
    expect(0).toBe(1)
  }
})

test('Get block by Hash', async () => {
  try {
    expect(await api.getBlockByHash(Mock.blockHash))
  } catch (err) {
    console.error('Get block by Hash Error :', err)
    expect(0).toBe(1)
  }
})

test('Get block header by Hash', async () => {
  try {
    expect(await api.getBlockHeaderByHash(Mock.blockHash))
  } catch (err) {
    console.error('Get block header by Hash Error :', err)
    expect(0).toBe(1)
  }
})

test('Get block header by Height', async () => {
  try {
    expect(await api.getBlockHeaderByHeight(Mock.blockHeight))
  } catch (err) {
    console.error('Get block header by Height Error :', err)
    expect(0).toBe(1)
  }
})

test('Get block Height', async () => {
  try {
    expect(await api.getBlockHeight())
  } catch (err) {
    console.error('Get block Height Error :', err)
    expect(0).toBe(1)
  }
})

test('View block detail', async () => {
  try {
    expect(await api.viewBlockDetail(Mock.blockHash))
  } catch (err) {
    console.error('View block detail Error :', err)
    expect(0).toBe(1)
  }
})
