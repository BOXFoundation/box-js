import 'jest'
import { Core } from '../src/boxd/core/core'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
// import { UnsignedSplitAddrTx } from '../src/boxd/core/response'

const cor = new Core(fetch, Data.endpoint)

/* test('Add Node', async () => {
  // test func [Core.addNode]
  await cor
    .addNode(Data.nodeId)
    .then(res => {
            expect(res.code).toEqual(0)
      expect(res.message).toEqual('success')
      expect(res.splitAddr).toEqual('b2MCXkq7qRzBunNGCdiqL1mZSpUSNqdWYqP')
    })
    .catch(err => {
      console.error('addNode err:', err)
    })
}) */

/* test('Get Block By Height', async () => {
  // test func [Core.getBlockByHeight]
  await cor
    .getBlockByHeight(Data.height)
    .then(res => {
      console.log('getBlockByHeight res:', res)
    })
    .catch(err => {
      console.error('addNode err:', err)
    })
}) */

/* test('Get Block By BlockHash', async () => {
  // test func [Core.getBlockByBlockHash]
  await cor
    .getBlockByBlockHash(Data.blockHash)
    .then(res => {
      console.log('getBlockByBlockHash res:', res)
    })
    .catch(err => {
      console.error('addNode err:', err)
    })
}) */
