import 'jest'
import Api from '../src/boxd/core/api'
import fetch from 'isomorphic-fetch'
import Mock from './json/mock.json'

const cor = new Api(fetch, Mock.endpoint_js, 'http')

test('Get logs', async () => {
  const logs = await cor.getLogs(Mock.constract_logs_req)
  console.log('logs :', logs)
})
