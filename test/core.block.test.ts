import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Mock from './json/mock.json'

const cor = new Api(fetch, Mock.endpoint_test, 'http')
let node_id

test('Get node info', async () => {
  try {
    const node_info = await cor.getNodeInfo()
    node_id = node_info.nodes[0].id
    // console.log('node_id:', node_id)
    expect(node_id)
  } catch (err) {
    console.error('Get node info: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get block hash by height', async () => {
  try {
    const block_height = await cor.getBlockHashByHeight(Mock.blockHeight)
    expect(block_height)
  } catch (err) {
    console.error('Get block hash by height: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get block by height', async () => {
  try {
    const block = await cor.getBlockByHeight(Mock.blockHeight)
    expect(block)
  } catch (err) {
    console.error('Get block by height: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get block by hash', async () => {
  try {
    const block = await cor.getBlockByHash(Mock.blockHash)
    expect(block)
  } catch (err) {
    console.error('Get block by hash: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get block header by hash', async () => {
  try {
    const block = await cor.getBlockHeaderByHash(Mock.blockHash)
    expect(block)
  } catch (err) {
    console.error('Get block header by hash: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get block header by height', async () => {
  try {
    const block = await cor.getBlockHeaderByHeight(Mock.blockHeight)
    expect(block)
  } catch (err) {
    console.error('Get block header by height: Error !', err)
    expect(0).toBe(1)
  }
})

test('Get block height', async () => {
  try {
    const block = await cor.getBlockHeight()
    expect(block)
  } catch (err) {
    console.error('Get block height: Error !', err)
    expect(0).toBe(1)
  }
})

test('View block detail', async () => {
  try {
    const block_detail = await cor.viewBlockDetail(Mock.blockHash)
    expect(block_detail)
  } catch (err) {
    console.error('View block detail: Error !', err)
    expect(0).toBe(1)
  }
})
