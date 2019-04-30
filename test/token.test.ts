import 'jest'
import { encodeTokenAddr, decodeTokenAddr } from '../src/boxd/core/token/token'

const Core = require('./core/data.json')

test('Encode Token Address', async () => {
  // test func [encodeTokenAddr]
  const token_addr = await encodeTokenAddr(Core.token_hash, Core.token_index)
  expect(token_addr).toEqual(Core.token_addr)
})

test('Decode Token Address', async () => {
  // test func [decodeTokenAddr]
  const { opHash, index } = await decodeTokenAddr(Core.token_addr)
  expect(opHash).toEqual(Core.token_hash)
  expect(index).toEqual(Core.token_index)
})
