import 'jest'
import { Core } from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
// import { UnsignedSplitAddrTx } from '../src/boxd/core/response'

const cor = new Core(fetch, Data.endpoint_test)
/* let node_id

test('Get Node Info', async () => {
  // test func [Core.getNodeInfo]
  await cor
    .getNodeInfo()
    .then(node_info => {
      // console.log('node_info:', node_info)
      node_id = node_info.nodes[0].id
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
  // test func [Core.getBlockHash]
  await cor
    .getBlockHash(Data.blockHeight)
    .then(res => {
      // console.log('getBlockHash res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockHash err:', err)
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
  // test func [Core.getBlockByBlockHash]
  await cor
    .getBlockByBlockHash(Data.blockHash)
    .then(res => {
      // console.log('getBlockByBlockHash res:', res)
      expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('getBlockByBlockHash err:', err)
      expect(0).toBe(1)
    })
}) */
