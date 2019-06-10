import 'jest'
import Account from '../src/boxd/account/account'
import AccountManager from '../src/boxd/account/account-manager'
import Mock from './json/mock.json'
import Keystore from './json/keystore.json'

let acc_list_result
const OP_CODE_TYPE = 'hex'
const acc_buf = Buffer.from(Mock.acc_privateKey, OP_CODE_TYPE)
const updateAccount = (new_acc_list = {}) => {
  // console.log('new_acc_list', new_acc_list)
  acc_list_result = new_acc_list
}
const acc = new Account()
const accManager = new AccountManager(Mock.acc_list, updateAccount)

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  let addr = await acc.dumpAddrFromPrivKey(Mock.acc_privateKey)
  expect(addr).toEqual(Mock.acc_addr)
  addr = await acc.dumpAddrFromPrivKey(acc_buf)
  expect(addr).toEqual(Mock.acc_addr)
})

test('Dump Crypto Json from PrivateKey(string | Buffer)', async () => {
  let crypto_res = await acc.dumpCryptoFromPrivKey(
    Mock.acc_privateKey,
    Mock.acc_pwd
  )
  expect(typeof crypto_res).toEqual('object')
  crypto_res = await acc.dumpCryptoFromPrivKey(acc_buf, Mock.acc_pwd)
  expect(typeof crypto_res).toEqual('object')
})

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  let pubKey = await acc.dumpPubKeyFromPrivKey(Mock.acc_privateKey)
  expect(pubKey).toEqual(Mock.acc_publicKey)
  pubKey = await acc.dumpPubKeyFromPrivKey(acc_buf)
  expect(pubKey).toEqual(Mock.acc_publicKey)
})

test('Dump PublicKey Hash from PrivateKey(string | Buffer)', async () => {
  let pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(Mock.acc_privateKey)
  expect(pubKey_hash).toEqual(Mock.acc_publickey_hash)
  pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(acc_buf)
  expect(pubKey_hash).toEqual(Mock.acc_publickey_hash)
})

test('Dump PublicKey Hash from Address', async () => {
  const pubKey_hash = await acc.dumpPubKeyHashFromAddr(Mock.acc_addr)
  expect(pubKey_hash).toEqual(Mock.acc_publickey_hash)
})

test('Dump PrivateKey from Crypto Json', async () => {
  const privateKey = await acc.dumpPrivKeyFromCrypto(
    Keystore.keystore,
    Mock.acc_pwd
  )
  expect(privateKey).toEqual(Mock.acc_privateKey)
})

test('Dump PublicKey Hash from Address', async () => {
  const pubKey_hash = await acc.dumpPubKeyHashFromAddr(Mock.acc_addr)
  expect(pubKey_hash).toEqual(Mock.acc_publickey_hash)
})

test('Create an Account', async () => {
  const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(Mock.acc_pwd)
  expect(cryptoJSON.address).toEqual(P2PKH)
  await accManager.addToAccList(cryptoJSON, {
    name: Mock.acc_name,
    P2PKH
  })
  /*   console.log('Acc addr:', JSON.stringify(P2PKH))
  console.log('Acc cryptoJSON:', JSON.stringify(cryptoJSON))
  const privkey = await acc.dumpPrivKeyFromCrypto(cryptoJSON, Mock.acc_pwd)
  console.log('Acc privkey:', JSON.stringify(privkey)) */
  expect(acc_list_result[P2PKH].name).toEqual(Mock.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})

test('Import an Account by PrivateKey', async () => {
  const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(
    Mock.acc_pwd,
    Mock.acc_privateKey
  )
  expect(cryptoJSON.address).toEqual(P2PKH)
  await accManager.addToAccList(cryptoJSON, {
    name: Mock.acc_name,
    P2PKH
  })
  expect(acc_list_result[P2PKH].name).toEqual(Mock.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})

test('Import an Account by Crypto Json', async () => {
  const privkey = await acc.dumpPrivKeyFromCrypto(
    Keystore.keystore,
    Mock.acc_pwd
  )
  const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(Mock.acc_pwd, privkey)
  expect(cryptoJSON.address).toEqual(P2PKH)
  await accManager.addToAccList(cryptoJSON, {
    name: Mock.acc_name,
    P2PKH
  })
  expect(acc_list_result[P2PKH].name).toEqual(Mock.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})
