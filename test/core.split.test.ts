import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Mock from './json/mock.json'
import Feature from '../src/boxd/core/feature'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Mock.endpoint_test, 'http')
const feature = new Feature(fetch, Mock.endpoint_test, 'http')

test('Make a Split Contract Transaction', async () => {
  const tx_result = await feature.makeSplitTxByCrypto({
    tx: {
      from: Mock.acc_addr_1,
      addrs: Mock.to_addrs,
      weights: Mock.split_weights,
      fee: Mock.fee
    },
    crypto: Keystore.keystore_1,
    pwd: Mock.acc_pwd
  })
  // console.log('tx_result:', tx_result)
  const tx_detail = await cor.viewTxDetail(tx_result.hash)
  // console.log('tx_detail:', tx_detail)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
})
