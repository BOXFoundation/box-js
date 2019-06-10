import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'

const abi = new AbiCoder()

test('Calls encodeFunctionSignature with a string as parameter', async () => {
  try {
    expect(await abi.encodeFunctionSignature('test')).toEqual('0x9c22ff5f')
  } catch (err) {
    console.log('Calls encodeFunctionSignature Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeFunctionSignature with a object as parameter', async () => {
  try {
    expect(
      await abi.encodeFunctionSignature({
        name: 'test',
        inputs: [
          {
            type: 'uint256'
          }
        ]
      })
    ).toEqual('0x29e99f07')
  } catch (err) {
    console.log('Calls encodeFunctionSignature Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeParameter', async () => {
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
