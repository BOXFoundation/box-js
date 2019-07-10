// TODO
/* import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Mock from './json/mock.json'

const cor = new Api(fetch, Mock.endpoint_test, 'http')

test('Get logs', async () => {
  const logs = await cor.getLogs(Mock.constract_logs_req)
  console.log('logs :', logs)
}) */

import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Mock from './json/mock.json'

const cor = new Api(fetch, Mock.endpoint_test, 'http')

// NOW
test('Make a raw transaction', async () => {
  try {
    const tx = await cor.createRawTx({
      addr: Mock.acc_addr_3,
      to: Mock.to_map,
      fee: Mock.fee,
      privKey: Mock.acc_privateKey_3
    })
    expect(tx)
    console.log('created_tx:', JSON.stringify(tx))
  } catch (err) {
    console.error('Make a raw transaction: Error !', err)
    expect(0).toBe(1)
  }
})
