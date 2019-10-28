import 'jest'
import fetch from 'isomorphic-fetch'
import Mock from '../static/json/mock.json'
import Api from '../package/boxd/core/api'

const api = new Api(fetch, Mock.endpoint_dev, 'http')
const amount = 1000 * 100000000
const sleep = seconds => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

// test('faucet: common', async () => {
//   try {
//     await api.faucet({
//       addr: 'b1dDahJvyCicMuPwzkpRmhU7gqwyvq95nZZ',
//       amount
//     })
//     console.log(Mock.acc_addr, 'Charged', amount / 100000000, 'BOX')
//   } catch (err) {
//     expect(0).toBe(1)
//     console.log('[faucet] Error :', err)
//   }
//   await sleep(1)
// })

test('faucet: 0', async () => {
  try {
    await api.faucet({
      addr: Mock.acc_addr_3,
      amount
    })
    console.log(Mock.acc_addr_3, 'Charged', amount / 100000000, 'BOX')
  } catch (err) {
    console.log('[faucet] Error :', err)
    expect(0).toBe(1)
  }
  await sleep(1)
})
// test('faucet: 1', async () => {
//   try {
//     await api.faucet({
//       addr: Mock.acc_addr_1,
//       amount
//     })
//     console.log(Mock.acc_addr_1, 'Charged', amount / 100000000, 'BOX')
//   } catch (err) {
//     expect(0).toBe(1)
//   }
//   await sleep(1)
// })
// test('faucet: 2', async () => {
//   try {
//     await api.faucet({
//       addr: Mock.acc_addr_2,
//       amount
//     })
//     console.log(Mock.acc_addr_2, 'Charged', amount / 100000000, 'BOX')
//   } catch (err) {
//     expect(0).toBe(1)
//   }
//   await sleep(1)
// })
// test('faucet: 3', async () => {
//   try {
//     await api.faucet({
//       addr: Mock.acc_addr_3,
//       amount
//     })
//     console.log(Mock.acc_addr_3, 'Charged', amount / 100000000, 'BOX')
//   } catch (err) {
//     expect(0).toBe(1)
//   }
//   await sleep(1)
// })
// test('faucet: 4', async () => {
//   try {
//     await api.faucet({
//       addr: Mock.acc_addr_4,
//       amount
//     })
//     console.log(Mock.acc_addr_4, 'Charged', amount / 100000000, 'BOX')
//   } catch (err) {
//     expect(0).toBe(1)
//   }
// })
