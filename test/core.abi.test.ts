import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
import Data from './json/data.json'

const abi = new AbiCoder()

test('Encoded abi', async () => {
  const encoded = await abi.encodeParameter()
  console.log('encoded:', encoded)
})

test('Decoded abi', async () => {
  const decoded = await abi.decodeParameter()
  console.log('decoded:', decoded)
})
