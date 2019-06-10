import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Mock from './json/mock.json'

const cor = new Api(fetch, Mock.endpoint_test, 'http')
let node_id

test('Get Node Info', async () => {
  // test func [Api.getNodeInfo]
  await cor
    .getNodeInfo()
    .then(node_info => {
      // console.log('node_info:', node_info)
      node_id = node_info.nodes[0].id
      console.log('node_id:', node_id)
    })
    .catch(err => {
      console.error('getNodeInfo err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Hash by Height', async () => {
  // test func [Api.getBlockHashByHeight]
  await cor
    .getBlockHashByHeight(Mock.blockHeight)
    .then(res => {
      // console.log('getBlockHashByHeight res:', res)
      expect(res)
    })
    .catch(err => {
      console.error('getBlockHashByHeight err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block by Height', async () => {
  // test func [Api.getBlockByHeight]
  await cor
    .getBlockByHeight(Mock.blockHeight)
    .then(res => {
      // console.log('getBlockByHeight res:', res)
      expect(res)
    })
    .catch(err => {
      console.error('getBlockByHeight err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block by Hash', async () => {
  // test func [Api.getBlockByHash]
  await cor
    .getBlockByHash(Mock.blockHash)
    .then(res => {
      // console.log('getBlockByHash res:', res)
      expect(res)
    })
    .catch(err => {
      console.error('getBlockByHash err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Header by Hash', async () => {
  // test func [Api.getBlockHeaderByHash]
  await cor
    .getBlockHeaderByHash(Mock.blockHash)
    .then(res => {
      // console.log('getBlockHeaderByHash res:', res)
      expect(res)
    })
    .catch(err => {
      console.error('getBlockHeaderByHash err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Header by Height', async () => {
  // test func [Api.getBlockHeaderByHeight]
  await cor
    .getBlockHeaderByHeight(Mock.blockHeight)
    .then(res => {
      // console.log('getBlockHeaderByHeight res:', res)
      expect(res)
    })
    .catch(err => {
      console.error('getBlockHeaderByHeight err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Height', async () => {
  // test func [Api.getBlockHeight]
  await cor
    .getBlockHeight()
    .then(res => {
      // console.log('getBlockHeight res:', res)
      expect(res)
    })
    .catch(err => {
      console.error('getBlockHeight err:', err)
      expect(0).toBe(1)
    })
})

test('View Block Detail', async () => {
  // test func [Api.viewBlockDetail]
  await cor
    .viewBlockDetail(Mock.blockHash)
    .then(res => {
      // console.log('viewBlockDetail res:', JSON.stringify(res))
      expect(res)
    })
    .catch(err => {
      console.error('viewBlockDetail err:', err)
      expect(0).toBe(1)
    })
})
