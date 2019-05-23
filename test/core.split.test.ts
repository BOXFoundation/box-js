import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Data from './json/data.json'
import Feature from '../src/boxd/core/feature'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Data.endpoint_test, 'http')
const feature = new Feature(fetch, Data.endpoint_test, 'http')

test('Make a Split Contract Transaction', async () => {
  const tx_result = await feature.makeSplitTxByCrypto({
    tx: {
      from: Data.acc_addr_1,
      addrs: Data.to_addrs,
      weights: Data.split_weights,
      fee: Data.fee
    },
    crypto: Keystore.keystore_1,
    pwd: Data.acc_pwd
  })
  console.log('tx_result:', tx_result)
  const tx_detail = await cor.viewTxDetail(tx_result.hash)
  console.log('tx_detail:', tx_detail)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
})
