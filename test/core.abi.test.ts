import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
// import Data from './json/data.json'

const abi = new AbiCoder()

/* it('constructor check', () => {
  expect(abiCoder.utils).toEqual(Utils);

  expect(abiCoder.ethersAbiCoder).toEqual(ethersAbiCoderMock);
}); */

it('Calls encodeParameter', async () => {
  try {
    const encoded = await abi.encodeParameter('uint256 t', '99')
    console.log('encoded:', encoded)
    expect(encoded).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('calls encodeParameter Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeParameters', async () => {
  try {
    const encoded = await abi.encodeParameters(['uint256 t'], ['99'])
    console.log('encoded:', encoded)
    expect(encoded).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('calls encodeParameters Error:', err)
    expect(0).toBe(1)
  }
})
