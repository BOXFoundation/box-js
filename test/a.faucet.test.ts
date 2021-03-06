import 'jest'
import fetch from 'isomorphic-fetch'
import Mock from '../static/json/mock.json'
import Api from '../package/boxd/core/api'

const api = new Api(fetch, Mock.endpoint_dev, 'http')
const amount = 1000 * 100000000
const faucet_addr_list = [
  Mock.addr,
  Mock.addr_1,
  Mock.addr_2,
  Mock.addr_3,
  Mock.addr_4
]
// const faucet_addr_list = ['b1hp5raZBs6D1d6rTrq5Hir3y1gkbtLgNub']

const sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

test('faucet', async () => {
  try {
    if (faucet_addr_list.length !== 0) {
      for (let addr of faucet_addr_list) {
        await api.faucet({
          addr,
          amount
        })
        console.log(addr, 'Charged', amount / 100000000, 'BOX')
        sleep(5)
      }
    }
  } catch (err) {
    console.log('[Faucet] Error :', err)
    expect(0).toBe(1)
  }
})
