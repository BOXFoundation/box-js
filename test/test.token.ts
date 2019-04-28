import { expect } from 'chai'
import 'mocha'
import {
  encodeTokenAddr,
  decodeTokenAddr
} from '../src/script/boxd/contract/token/token'

const _token_addr = '8b9aLjo62TiDWr3JoszMWYAQH5iEvJFKyNZJQ73ghywJC7ACVHh',
  _token_hash =
    'e26dc08ca79a9a07a82e2cef5350ae74f2590385fa1d316a5c7e9500c749ab71',
  _token_index = 0

describe('[test.token]', async () => {
  // test func [testEncodeTokenAddr]
  it('Encode Token Address', async () => {
    const token_addr = await encodeTokenAddr(_token_hash, _token_index)
    expect(token_addr).to.equal(_token_addr)
  })
  // test func [testEncodeTokenAddr]
  it('Decode Token Address', async () => {
    const { opHash, index } = await decodeTokenAddr(_token_addr)
    expect(opHash).to.equal(_token_hash)
    expect(index).to.equal(_token_index)
  })
})
