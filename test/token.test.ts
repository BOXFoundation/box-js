import 'jest'
import { encodeTokenAddr, decodeTokenAddr } from '../src/boxd/core/token/token'

const Data = require('./json/data.json')

test('Encode Token Address', async () => {
  // test func [encodeTokenAddr]
  const token_addr = await encodeTokenAddr(Data.token_hash, Data.token_index)
  expect(token_addr).toEqual(Data.token_addr)
})

test('Decode Token Address', async () => {
  // test func [decodeTokenAddr]
  const { opHash, index } = await decodeTokenAddr(Data.token_addr)
  expect(opHash).toEqual(Data.token_hash)
  expect(index).toEqual(Data.token_index)
})
