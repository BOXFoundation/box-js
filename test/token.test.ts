import 'jest'
import {
  encodeTokenAddr,
  decodeTokenAddr
} from '../src/script/boxd/contract/token/token'

const Token = require('./core/token.json')

test('Encode Token Address', async () => {
  // test func [encodeTokenAddr]
  const token_addr = await encodeTokenAddr(Token.token_hash, Token.token_index)
  expect(token_addr).toEqual(Token.token_addr)
})

test('Decode Token Address', async () => {
  // test func [decodeTokenAddr]
  const { opHash, index } = await decodeTokenAddr(Token.token_addr)
  expect(opHash).toEqual(Token.token_hash)
  expect(index).toEqual(Token.token_index)
})
