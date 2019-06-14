import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'

const abi = new AbiCoder()
const contract_type_uint = 'uint256'

test('Calls encodeFunctionSignature with a parameters(string)', async () => {
  try {
    expect(await abi.encodeFunctionSignature('test')).toEqual('0x9c22ff5f')
  } catch (err) {
    console.log('Calls encodeFunctionSignature Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeFunctionSignature with parameters(object)', async () => {
  try {
    expect(
      await abi.encodeFunctionSignature({
        name: 'test',
        inputs: [
          {
            type: contract_type_uint
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
    expect(await abi.encodeParameter(contract_type_uint, 99)).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('Calls encodeParameter Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeParameters', async () => {
  try {
    expect(await abi.encodeParameters([contract_type_uint], [99])).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('Calls encodeParameters Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeFunctionCall and returns the expected string', async () => {
  try {
    expect(
      await abi.encodeFunctionCall(
        {
          name: 'test',
          inputs: [
            {
              type: contract_type_uint
            }
          ]
        },
        [99]
      )
    ).toEqual(
      '0x29e99f070000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('Calls encodeFunctionCall Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter(uint256) and returns the expected number', async () => {
  try {
    const decoded = await abi.decodeParameter(
      contract_type_uint,
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000037',
        'hex'
      )
    )
    expect(decoded).toEqual(55)
  } catch (err) {
    console.log('Calls decodeParameter(uint256) Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter(string) and returns the expected string', async () => {
  try {
    const decoded = await abi.decodeParameter(
      'string',
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000020' +
          '000000000000000000000000000000000000000000000000000000000000000d' +
          '6f6e65206d6f72652074696d6500000000000000000000000000000000000000',
        'hex'
      )
    )
    expect(decoded).toEqual('one more time')
  } catch (err) {
    console.log('Calls decodeParameter(string) Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter(string) and returns the expected string', async () => {
  try {
    const decoded = await abi.decodeParameter(
      'string',
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000020' +
          '0000000000000000000000000000000000000000000000000000000000000000',
        'hex'
      )
    )
    expect(decoded).toEqual('')
  } catch (err) {
    console.log('Calls decodeParameter(string) Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameters(uint256[]) and returns the expected object', async () => {
  try {
    const decoded = await abi.decodeParameters(
      [contract_type_uint, contract_type_uint],
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000037' +
          '0000000000000000000000000000000000000000000000000000000000000007',
        'hex'
      )
    )
    expect(decoded).toEqual({ 0: 55, 1: 7 })
  } catch (err) {
    console.log('Calls decodeParameters(uint256[]) Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameters(string[]) and returns the expected object', async () => {
  try {
    const decoded = await abi.decodeParameters(
      ['string', 'string', 'string', 'string'],
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000080' +
          '00000000000000000000000000000000000000000000000000000000000000c0' +
          '0000000000000000000000000000000000000000000000000000000000000100' +
          '0000000000000000000000000000000000000000000000000000000000000140' +
          '0000000000000000000000000000000000000000000000000000000000000004' +
          '6465663100000000000000000000000000000000000000000000000000000000' +
          '0000000000000000000000000000000000000000000000000000000000000004' +
          '6768693100000000000000000000000000000000000000000000000000000000' +
          '0000000000000000000000000000000000000000000000000000000000000004' +
          '6a6b6c3100000000000000000000000000000000000000000000000000000000' +
          '0000000000000000000000000000000000000000000000000000000000000004' +
          '6d6e6f3200000000000000000000000000000000000000000000000000000000',
        'hex'
      )
    )
    expect(decoded).toEqual({
      0: 'def1',
      1: 'ghi1',
      2: 'jkl1',
      3: 'mno2'
    })
  } catch (err) {
    console.log('Calls decodeParameters(string[]) Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameters and throws an error', () => {
  expect(() => {
    abi.decodeParameters(['0'], '0x')
  }).toThrow('Invalid bytes string given: 0x')

  expect(() => {
    abi.decodeParameters(['0'], '0X')
  }).toThrow('Invalid bytes string given: 0X')

  expect(() => {
    abi.decodeParameters([], '0X')
  }).toThrow('Empty outputs array given!')
})
