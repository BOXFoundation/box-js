import 'jest'
import fetch from 'isomorphic-fetch'
import Api from '../src/boxd/core/api'
import Mock from './json/mock.json'
import Feature from '../src/boxd/core/feature'
import Keystore from './json/keystore.json'

const cor = new Api(fetch, Mock.endpoint_dev, 'http')
const feature = new Feature(fetch, Mock.endpoint_dev, 'http')

jest.setTimeout(10000)

test('Make a split contract transaction', async () => {
  try {
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
    // console.log('tx_result :', tx_result)
    const tx_detail = await cor.viewTxDetail(tx_result.hash)
    // console.log('tx_detail :', tx_detail)
    expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  } catch (err) {
    console.error('Make a split contract transaction Error :', err)
    expect(0).toBe(1)
  }
})
