import CommonUtil from '../../../util/util'
import AbiUtil from './util'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

export default class AbiCoder {
  /**
   * Encodes the function name to its ABI representation, which are the first 4 bytes of the keccak256 of the function name including types.
   *
   * @param [functionName] string|object
   * @returns {encoded function name} string
   */
  public async encodeFunctionSignature(functionName: string | object) {
    if (isObject(functionName)) {
      functionName = CommonUtil.jsonInterfaceMethodToString(functionName)
    }
    const keccaked = await CommonUtil.keccak256(functionName)
    if (keccaked) {
      return keccaked.slice(0, 10)
    } else {
      throw new Error('keccak return Null !')
    }
  }

  /**
   * Encodes the function name to its ABI representation, which are the first 4 bytes of the keccak256 of the function name including  types.
   *
   * @param [functionName] string|object
   * @returns {encoded function name} string
   */
  public encodeEventSignature(functionName: string | object) {
    if (isObject(functionName)) {
      functionName = CommonUtil.jsonInterfaceMethodToString(functionName)
    }

    return CommonUtil.keccak256(functionName)
  }

  /**
   * Should be used to encode plain param
   *
   * @param [type] string
   * @param [param] string
   * @returns {encoded plain param} string
   */
  public encodeParameter(type: string, param: string) {
    return this.encodeParameters([type], [param])
  }

  /**
   * Should be used to encode list of params
   *
   * @param [types] array
   * @param [params] array
   * @returns {encoded list of params} string
   */
  public async encodeParameters(types: string[], params: (string | object)[]) {
    return await AbiUtil.rawEncode(types, params).toString('hex')
  }

  /**
   * Encodes a function call from its json interface and parameters.
   *
   * @param [jsonInterface] object
   * @param [params] array
   * @returns {the encoded ABI for this function call} string
   */
  public async encodeFunctionCall(
    jsonInterface: object,
    params: (string | object)[]
  ) {
    const signature = await this.encodeFunctionSignature(jsonInterface)
    let type_arr: string[] = []
    await jsonInterface['inputs'].forEach(item => {
      type_arr.push(item.type)
    })
    const inputs = await this.encodeParameters(type_arr, params)
    return signature + inputs
  }

  /**
   * Should be used to decode bytes to plain param
   *
   * @param [type] string
   * @param [bytes] string
   * @returns {plain param} object
   */
  public decodeParameter(output: string | object, bytes: string) {
    return this.decodeParameters([output], bytes)[0]
  }

  /**
   * Should be used to decode list of params
   *
   * @param [outputs] {array<string|object>|object}
   * @param [bytes] string
   * @returns {Object with named and indexed properties of the returnValues} object
   */
  public decodeParameters(outputs: (string | object)[], bytes: string) {
    if (isArray(outputs) && outputs.length === 0) {
      throw new Error('Empty outputs array given!')
    }

    if (!bytes || bytes === '0x' || bytes === '0X') {
      throw new Error(`Invalid bytes string given: ${bytes}`)
    }

    const result = AbiUtil.rawDecode(outputs, bytes)
    let returnValues = {}
    let decodedValue

    if (result) {
      if (outputs.length > 1) {
        outputs.forEach((output, i) => {
          decodedValue = result[i]

          if (decodedValue === '0x') {
            decodedValue = null
          }

          returnValues[i] = decodedValue

          if (isObject(output) && output['name']) {
            returnValues[output['name']] = decodedValue
          }
        })

        return returnValues
      }

      return result
    }

    if (isObject(outputs[0]) && outputs[0]['name']) {
      returnValues[outputs[0]['name']] = result
    }

    returnValues[0] = result

    return returnValues
  }

  /**
   * @TODO
   * Decodes events non- and indexed parameters.
   *
   * @param [inputs] array
   * @param [data] string
   * @param [topics] array
   * @returns {Object with named and indexed properties of the returnValues} object
   */
  /*   public decodeLog(inputs, data = '', topics) {
    const returnValues = {}
    let topicCount = 0
    let value
    let nonIndexedInputKeys
    let nonIndexedInputItems

    if (!isArray(topics)) {
      topics = [topics]
    }
    inputs.forEach((input, i) => {
      if (input.indexed) {
        if (input.type === 'string') {
          return
        }
        value = topics[topicCount]
        if (this.isStaticType(input.type)) {
          value = this.decodeParameter(input.type, topics[topicCount])
        }
        returnValues[i] = value
        returnValues[input.name] = value
        topicCount++
        return
      }
      nonIndexedInputKeys.push(i)
      nonIndexedInputItems.push(input)
    })
    if (data) {
      let values = this.decodeParameters(nonIndexedInputItems, data)
      let decodedValue
      nonIndexedInputKeys.forEach((itemKey, index) => {
        decodedValue = values[index]
        returnValues[itemKey] = decodedValue
        returnValues[nonIndexedInputItems[index].name] = decodedValue
      })
    }

    return returnValues
  } */

  /**
   * @TODO
   * Checks if a given type string is a static solidity type
   *
   * @param [type] string
   * @returns {is static type ?} boolean
   */
  /*   public isStaticType(type) {
    if (type === 'bytes') {
      return false
    }
    if (type === 'string') {
      return false
    }
    if (type.indexOf('[') && type.slice(type.indexOf('[')).length === 2) {
      return false
    }

    return true
  } */
}
