import ethAbi from 'ethereumjs-abi'
import * as web3Utils from 'web3-utils'
import Util from '../../../util/util'
import isObject from 'lodash/isObject'

export default class AbiCoder {
  /**
   * Encodes the function name to its ABI representation, which are the first 4 bytes of the keccak256 of the function name including  types.
   *
   * @method encodeFunctionSignature
   *
   * @param {String|Object} functionName
   *
   * @returns {String} encoded function name
   */
  public async encodeFunctionSignature(functionName) {
    if (isObject(functionName)) {
      functionName = Util.jsonInterfaceMethodToString(functionName)
    }
    const keccaked = await Util.keccak256(functionName)
    console.log('keccaked:', keccaked)
    if (keccaked) {
      return keccaked.slice(0, 10)
    } else {
      throw new Error('keccak return Null !')
    }
  }

  /**
   * Encodes the function name to its ABI representation, which are the first 4 bytes of the keccak256 of the function name including  types.
   *
   * @method encodeEventSignature
   *
   * @param {String|Object} functionName
   *
   * @returns {String} encoded function name
   */
  public encodeEventSignature(functionName) {
    // if (isObject(functionName)) {
    functionName = web3Utils.jsonInterfaceMethodToString(functionName)
    // }

    return web3Utils.keccak256(functionName)
  }

  /**
   * Should be used to encode plain param
   *
   * @method encodeParameter
   *
   * @param {String} type
   * @param {Object} param
   *
   * @returns {String} encoded plain param
   */
  public encodeParameter(type, param) {
    return this.encodeParameters([type], [param])
  }

  /**
   * Should be used to encode list of params
   *
   * @method encodeParameters
   *
   * @param {Array} types
   * @param {Array} params
   *
   * @returns {String} encoded list of params
   */
  public async encodeParameters(types, params) {
    return await ethAbi.rawEncode(types, params).toString('hex')
  }

  /**
   * Encodes a function call from its json interface and parameters.
   *
   * @method encodeFunctionCall
   *
   * @param {Object} jsonInterface
   * @param {Array} params
   *
   * @returns {String} The encoded ABI for this function call
   */
  public async encodeFunctionCall(jsonInterface, params) {
    const signature = await this.encodeFunctionSignature(jsonInterface)
    console.log('signature===:', signature)
    let type_arr: string[] = []
    console.log('flag:', jsonInterface.inputs)
    await jsonInterface.inputs.forEach(item => {
      console.log('item.type:', item.type)
      type_arr.push(item.type)
    })
    const inputs = await this.encodeParameters(type_arr, params)
    console.log('inputs===:', inputs)
    const result = `${signature}${inputs}`
    console.log('result===:', result)
    return result // .replace('0x', '')
  }

  /**
   * Should be used to decode bytes to plain param
   *
   * @method decodeParameter
   *
   * @param {String} type
   * @param {String} bytes
   *
   * @returns {Object} plain param
   */
  public decodeParameter(type, bytes) {
    return this.decodeParameters([type], bytes)[0]
  }

  /**
   * Should be used to decode list of params
   *
   * @method decodeParameter
   *
   * @param {Array<String|Object>|Object} outputs
   * @param {String} bytes
   *
   * @returns {Object} Object with named and indexed properties of the returnValues
   */
  public decodeParameters(outputs, bytes) {
    /*     if (isArray(outputs) && outputs.length === 0) {
      throw new Error('Empty outputs array given!')
    } */

    if (!bytes || bytes === '0x' || bytes === '0X') {
      throw new Error(`Invalid bytes string given: ${bytes}`)
    }

    const result = ethAbi.rawDecode(outputs, bytes)
    let returnValues = {}
    let decodedValue

    if (result) {
      // isArray(
      if (outputs.length > 1) {
        outputs.forEach((output, i) => {
          decodedValue = result[i]

          if (decodedValue === '0x') {
            decodedValue = null
          }

          returnValues[i] = decodedValue

          // if (isObject(output) && output.name) {
          returnValues[output.name] = decodedValue
          // }
        })

        return returnValues
      }

      return result
    }

    // if (isObject(outputs[0]) && outputs[0].name) {
    returnValues[outputs[0].name] = result
    // }

    returnValues[0] = result

    return returnValues
  }

  /**
   * Decodes events non- and indexed parameters.
   *
   * @method decodeLog
   *
   * @param {Array} inputs
   * @param {String} data
   * @param {Array} topics
   *
   * @returns {Object} Object with named and indexed properties of the returnValues
   */
  public decodeLog(inputs, data = '', topics) {
    const returnValues = {}
    let topicCount = 0
    let value
    let nonIndexedInputKeys
    let nonIndexedInputItems

    /*     if (!isArray(topics)) {
      topics = [topics]
    } */

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
  }

  /**
   * Checks if a given type string is a static solidity type
   *
   * @method isStaticType
   *
   * @param {String} type
   *
   * @returns {Boolean}
   */
  public isStaticType(type) {
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
  }
}
