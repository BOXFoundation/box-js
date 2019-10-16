import 'jest'
import fetch from 'isomorphic-fetch'
import Mock from '../static/json/mock.json'
import Api from '../package/boxd/core/api'

const api = new Api(fetch, Mock.endpoint_dev, 'http')
const sleep = seconds => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
const amount = 1000 * 100000000

test('faucet', async () => {
  try {
    await api.faucet({
      addr: Mock.acc_addr_3,
      amount
    })
    console.log(Mock.acc_addr, 'Charged', amount / 100000000, 'BOX')
  } catch (err) {
    expect(0).toBe(1)
    console.log('[faucet] Error :', err)
  }
  await sleep(1)
})
// test('faucet_1', async () => {
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
// test('faucet_2', async () => {
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
// test('faucet_3', async () => {
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
// test('faucet_4', async () => {
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
