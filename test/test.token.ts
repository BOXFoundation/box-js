/* import 'mocha'
import should from 'should' */
import {
  encodeTokenAddr,
  decodeTokenAddr
} from '../src/script/boxd/contract/token/token'

const _token_addr = '8b9aLjo62TiDWr3JoszMWYAQH5iEvJFKyNZJQ73ghywJC7ACVHh',
  _token_hash =
    'e26dc08ca79a9a07a82e2cef5350ae74f2590385fa1d316a5c7e9500c749ab71',
  _token_index = 0

const testEncodeTokenAddr = async () => {
  const token_addr = await encodeTokenAddr(_token_hash, _token_index)
  console.log('[test.token] EncodeTokenAddr:', token_addr === _token_addr)
  return token_addr
}

const testDecodeTokenAddr = async () => {
  const token_addr = await testEncodeTokenAddr()
  const { opHash, index } = await decodeTokenAddr(token_addr)
  console.log(
    '[test.token] DecodeTokenAddr:',
    opHash === _token_hash,
    index === _token_index
  )
}

testDecodeTokenAddr()
