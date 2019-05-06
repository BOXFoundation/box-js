import 'jest'
import Account from '../src/boxd/account/account'
import Core from './json/data.json'

let result_acc_list

const updateAccount = (new_acc_list = {}) => {
  // console.log('new_acc_list', new_acc_list)
  result_acc_list = new_acc_list
}

const acc = new Account(Core.acc_list, updateAccount)

test('dumpAddrFromPrivKey', async () => {
  // test func [dumpAddrFromPrivKey]
  const addr = acc.dumpAddrFromPrivKey(Core.acc_privateKey_1)
  expect(addr).toEqual(Core.acc_addr)
})

test('Create an account', async () => {
  // test func [getCryptoAcc]
  const { cryptoJson, P2PKH } = acc.getCryptoAcc(Core.acc_pwd)
  expect(cryptoJson.address).toEqual(P2PKH)
  // test func [addToAccList]
  acc.addToAccList(cryptoJson, {
    name: Core.acc_name,
    P2PKH
  })
  expect(result_acc_list[P2PKH].name).toEqual(Core.acc_name)
  expect(result_acc_list[P2PKH].P2PKH).toEqual(P2PKH)
})

test('Import an account by KeyStore', async () => {})

test('Import an account by PrivateKey', async () => {
  // test func [getCryptoAcc]
  const { cryptoJson, P2PKH } = acc.getCryptoAcc(
    Core.acc_pwd,
    Core.acc_privateKey
  )
  expect(cryptoJson.address).toEqual(P2PKH)
  // test func [addToAccList]
  acc.addToAccList(cryptoJson, {
    name: Core.acc_name,
    P2PKH
  })
  expect(result_acc_list[P2PKH].name).toEqual(Core.acc_name)
  expect(result_acc_list[P2PKH].P2PKH).toEqual(P2PKH)
})
