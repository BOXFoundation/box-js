import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
import Mock from './json/mock.json'

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
            type: Mock.contract_abi_encode_param_type
          }
        ]
      })
    ).toEqual(Mock.contract_abi_signed_func)
  } catch (err) {
    console.log('Calls encodeFunctionSignature Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeParameter', async () => {
  try {
    expect(
      await abi.encodeParameter(
        Mock.contract_abi_encode_param_type,
        Mock.contract_abi_encode_param_val
      )
    ).toEqual(Mock.contract_abi_encoded_param)
  } catch (err) {
    console.log('calls encodeParameter Error:', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeParameters', async () => {
  try {
    expect(
      await abi.encodeParameters(
        [Mock.contract_abi_encode_param_type],
        [Mock.contract_abi_encode_param_val]
      )
    ).toEqual(Mock.contract_abi_encoded_param)
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
            type: Mock.contract_abi_encode_param_type
          }
        ]
      },
      [Mock.contract_abi_encode_param_val]
    )
  ).toEqual(Mock.contract_abi_encode_functioncall)
})

test('Calls decodeParameter(uint256) and returns the expected object', async () => {
  try {
    const decoded = await abi.decodeParameter(
      'uint256',
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000037',
        'hex'
      )
    )
    expect(decoded).toEqual(55)
  } catch (err) {
    console.log(
      'Calls decodeParameter(uint256) and returns the expected object Error:',
      err
    )
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter(string) and returns the expected object', async () => {
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
    console.log(
      'Calls decodeParameter(string) and returns the expected object Error:',
      err
    )
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter(string) and returns the expected object', async () => {
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
    console.log(
      'Calls decodeParameter(string) and returns the expected object Error:',
      err
    )
    expect(0).toBe(1)
  }
})

test('Calls decodeParameters(uint256[]) and returns the expected object', async () => {
  try {
    const decoded = await abi.decodeParameters(
      ['uint256', 'uint256'],
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000037' +
          '0000000000000000000000000000000000000000000000000000000000000007',
        'hex'
      )
    )
    expect(decoded).toEqual({ 0: 55, 1: 7 })
  } catch (err) {
    console.log(
      'Calls decodeParameters(uint256[]) and returns the expected object Error:',
      err
    )
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
    console.log(
      'Calls decodeParameters(string[]) and returns the expected object Error:',
      err
    )
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter("") and returns the "Empty List"', async () => {
  try {
    await abi.decodeParameter('', '')
  } catch (err) {
    console.log(
      'Calls decodeParameters(uint256[]) and returns the "Empty List":'
    )
  }
})

test('Calls decodeParameter and returns the expected object', async () => {
  try {
    const decoded = await abi.decodeParameter(
      { name: 'uint256' },
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000037',
        'hex'
      )
    )
    console.log('decoded:', JSON.stringify(decoded))
  } catch (err) {
    console.log(
      'Calls decodeParameter and returns the expected object Error:',
      err
    )
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
