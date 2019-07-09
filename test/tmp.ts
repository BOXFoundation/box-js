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

import  from '../src/protobuf/transaction_pb.js'
var peopleMsg = require('./')
var message = new peopleMsg.peopleRequest() // 创建一个MyMessage结构体

const org = {
  vin: [
    {
      prev_out_point: {
        hash: 'IGApUTN35F/tXPhIa3ZmSGSoE40cxSSMhCAuqyyAO1Q='
      }
    }
  ],
  vout: [
    {
      value: 100,
      script_pub_key: 'dqkUcIrRpe06i0lmWH1Zu8vOapPSXW2IrA=='
    },
    {
      value: 200,
      script_pub_key: 'dqkUfi1diQKIZj/mw0R8490mX06i8jmIrA=='
    },
    {
      value: 300,
      script_pub_key: 'dqkUfuTsdGlaQr9uO7iNomQcyzhPAh2IrA=='
    },
    {
      value: 400,
      script_pub_key: 'dqkUyEHUDt7aGspXa4FdCNpbNUWryEKIrA=='
    },
    {
      value: 32999999999998950,
      script_pub_key: 'dqkUgWZmsxg0lGj4FG525ON1HZN8FMuIrA=='
    }
  ]
}

test('protocal buffers', () => {
  const pb = org.serializeBinary()
  console.log('pb :', pb)
})
