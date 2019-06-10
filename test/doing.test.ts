import 'jest'
// import * as Utils from 'web3-utils'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
// import Data from './json/data.json'

const abi = new AbiCoder()

/* it('constructor check', () => {
  expect(abiCoder.utils).toEqual(Utils);

  expect(abiCoder.ethersAbiCoder).toEqual(ethersAbiCoderMock);
}); */

it('Calls encodeFunctionSignature with a string as parameter', () => {
  expect(abi.encodeFunctionSignature('test')).toEqual('0x9c22ff5f')
})

it('Calls encodeFunctionSignature with a object as parameter', () => {
  expect(
    abi.encodeFunctionSignature({
      name: 'test',
      inputs: [
        {
          type: 'uint256'
        }
      ]
    })
  ).toEqual('0x29e99f07')
})

it('Calls encodeParameter', async () => {
  try {
    const encoded = await abi.encodeParameter('uint256', '99')
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
    const encoded = await abi.encodeParameters(['uint256'], ['99'])
    console.log('encoded:', encoded)
    expect(encoded).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('calls encodeParameters Error:', err)
    expect(0).toBe(1)
  }
})

test('calls encodeFunctionCall and returns the expected string', async () => {
  expect(
    await abi.encodeFunctionCall(
      {
        name: 'test',
        inputs: [
          {
            type: 'uint256'
          }
        ]
      },
      ['99']
    )
  ).toEqual(
    '0x29e99f070000000000000000000000000000000000000000000000000000000000000063'
  )
})
