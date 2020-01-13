import 'jest'
import BN from 'bn.js'
import AbiCoder from '../package/boxd/core/contract/abi/abicoder'

const abi = new AbiCoder()

/* == encode function signature == */

test('Calls encodeFunctionSignature with a parameters (string)', async () => {
  try {
    expect(await abi.encodeFunctionSignature('test')).toEqual('9c22ff5f')
  } catch (err) {
    console.log('Calls encodeFunctionSignature (string) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeFunctionSignature with parameters (object)', async () => {
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
    ).toEqual('29e99f07')
  } catch (err) {
    console.log('Calls encodeFunctionSignature (object) Error :', err)
    expect(0).toBe(1)
  }
})

/* == encode parameter == */

test('Calls encodeParameter (string)', async () => {
  try {
    expect(await abi.encodeParameter('uint256', 99)).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('Calls encodeParameter (string) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeParameter (bytes)', async () => {
  try {
    expect(await abi.encodeParameter('bytes', 'hello world')).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000'
    )
  } catch (err) {
    console.log('Calls encodeParameter (bytes) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls encodeParameter (address)', async () => {
  try {
    expect(
      await abi.encodeParameter(
        'address',
        '0005b7d915458ef540ade6068dfe2f44e8fa733c'
      )
    ).toEqual(
      '0000000000000000000000000005b7d915458ef540ade6068dfe2f44e8fa733c'
    )
  } catch (err) {
    console.log('Calls encodeParameter (address) Error :', err)
    expect(0).toBe(1)
  }
})

/* == encode parameters == */

test('Calls encodeParameters ([bool, uint256])', async () => {
  try {
    expect(await abi.encodeParameters(['bool', 'uint256'], [true, 42])).toEqual(
      '0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002a'
    )
  } catch (err) {
    console.log('Calls encodeParameters ([bool, uint256]) Error :', err)
    expect(0).toBe(1)
  }
})

/* == encode function call == */

test('Calls encodeFunctionCall and returns the expected string', async () => {
  try {
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
        [99]
      )
    ).toEqual(
      '29e99f070000000000000000000000000000000000000000000000000000000000000063'
    )
  } catch (err) {
    console.log('Calls encodeFunctionCall Error :', err)
    expect(0).toBe(1)
  }
})

/* == decode parameter == */

test('Calls decodeParameter (uint256) and returns the expected number', async () => {
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
    console.log('Calls decodeParameter (uint256) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter (uint32) and returns the expected number', async () => {
  try {
    const decoded = await abi.decodeParameter(
      'uint32',
      Buffer.from(
        '000000000000000000000000000000000000000000000000000000000000002a',
        'hex'
      )
    )
    expect(decoded).toEqual(42)
  } catch (err) {
    console.log('Calls decodeParameter (uint32) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter (string) and returns the expected string', async () => {
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
    console.log('Calls decodeParameter (string) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter ("") and returns the expected string', async () => {
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
    console.log('Calls decodeParameter ("") Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter (address) with leading 0 and returns the expected string', async () => {
  try {
    const decoded = await abi.decodeParameter(
      'address',
      Buffer.from(
        '0000000000000000000000000005b7d915458ef540ade6068dfe2f44e8fa733c',
        'hex'
      )
    )
    expect(decoded).toEqual('0005b7d915458ef540ade6068dfe2f44e8fa733c')
  } catch (err) {
    console.log('Calls decodeParameter (address) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter (bytes) and returns the expected bytes', async () => {
  try {
    const decoded = await abi.decodeParameter(
      'bytes',
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000',
        'hex'
      )
    )
    const bytes = Buffer.from('68656c6c6f20776f726c64', 'hex')
    expect(decoded.toString()).toEqual(bytes.toString())
  } catch (err) {
    console.log('Calls decodeParameter (bytes) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameter (int32) and returns the expected number', async () => {
  try {
    const decoded = await abi.decodeParameter(
      'int32',
      Buffer.from(
        'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe',
        'hex'
      )
    )
    const int32 = new BN(-2)
    expect(decoded.toString()).toEqual(int32.toString())
  } catch (err) {
    console.log('Calls decodeParameter (int32) Error :', err)
    expect(0).toBe(1)
  }
})

/* == decode parameters == */

test('Calls decodeParameters (uint256[]) and returns the expected object', async () => {
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
    console.log('Calls decodeParameters (uint256[]) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameters (string[]) and returns the expected object', async () => {
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
    console.log('Calls decodeParameters (string[]) Error :', err)
    expect(0).toBe(1)
  }
})

test('Calls decodeParameters ([bool, uint256]) and returns the expected object', async () => {
  try {
    const decoded = await abi.decodeParameters(
      ['bool', 'uint256'],
      Buffer.from(
        '0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002a',
        'hex'
      )
    )
    expect(decoded).toEqual({ 0: true, 1: 42 })
  } catch (err) {
    console.log('Calls decodeParameters ([bool, uint256]) Error :', err)
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
