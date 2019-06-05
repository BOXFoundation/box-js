import 'jest'
import ethAbi from 'ethereumjs-abi'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
// import Data from './json/data.json'

const abi = new AbiCoder()

/* it('constructor check', () => {
  expect(abiCoder.utils).toEqual(Utils);

  expect(abiCoder.ethersAbiCoder).toEqual(ethersAbiCoderMock);
}); */

/* test('calls encodeParameters', async () => {
  const encoded = await abi.encodeParameters(ethAbi.fromSerpent('a'), [])
  console.log('encoded:', encoded)
  expect(encoded).toEqual(true)
  expect(ethAbi.rawEncode).toHaveBeenCalledWith(ethAbi.fromSerpent('a'), [])
}) */

test('calls decodeParameter and returns the expected object', async () => {
  const decoded = await abi.decodeParameter({ name: 'output' }, '0x0')
  expect(decoded).toEqual('0')
  expect(ethAbi.rawDecode).toHaveBeenCalledWith([{ name: 'output' }], '0x0')
})
