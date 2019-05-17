import 'jest'
import Core from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
// import { UnsignedSplitAddrTx } from '../src/boxd/core/response'

const cor = new Core(fetch, Data.endpoint_test)
let node_id

test('Get Node Info', async () => {
  // test func [Core.getNodeInfo]
  await cor
    .getNodeInfo()
    .then(node_info => {
      node_id = node_info.nodes[0].id
      console.log('node_id:', node_id)
    })
    .catch(err => {
      console.error('getNodeInfo err:', err)
      expect(0).toBe(1)
    })
})

test('Add Node', async () => {
  // test func [Core.addNode]
  await cor
    .addNode(node_id)
    .then(res => {
      console.log('addNode res:', res)
    })
    .catch(err => {
      console.error('addNode err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Hash by Height', async () => {
  // test func [Core.getBlockHashByHeight]
  await cor
    .getBlockHashByHeight(Data.blockHeight)
    .then(res => {
      // console.log('getBlockHashByHeight res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockHashByHeight err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block by Height', async () => {
  // test func [Core.getBlockByHeight]
  await cor
    .getBlockByHeight(Data.blockHeight)
    .then(res => {
      // console.log('getBlockByHeight res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockByHeight err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block by Hash', async () => {
  // test func [Core.getBlockByHash]
  await cor
    .getBlockByHash(Data.blockHash)
    .then(res => {
      // console.log('getBlockByHash res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockByHash err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Header by Hash', async () => {
  // test func [Core.getBlockHeaderByHash]
  await cor
    .getBlockHeaderByHash(Data.blockHash)
    .then(res => {
      // console.log('getBlockHeaderByHash res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockHeaderByHash err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Header by Height', async () => {
  // test func [Core.getBlockHeaderByHeight]
  await cor
    .getBlockHeaderByHeight(Data.blockHeight)
    .then(res => {
      // console.log('getBlockHeaderByHeight res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockHeaderByHeight err:', err)
      expect(0).toBe(1)
    })
})

test('Get Block Height', async () => {
  // test func [Core.getBlockHeight]
  await cor
    .getBlockHeight()
    .then(res => {
      // console.log('getBlockHeight res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockHeight err:', err)
      expect(0).toBe(1)
    })
})

test('View Block Detail', async () => {
  // test func [Core.viewBlockDetail]
  await cor
    .viewBlockDetail(Data.blockHash)
    .then(res => {
      // console.log('viewBlockDetail res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('viewBlockDetail err:', err)
      expect(0).toBe(1)
    })
})
