import 'jest'
import Account from '../src/boxd/account/account'
import AccountManager from '../src/boxd/account/account-manager'
import Data from './json/data.json'
import Keystore from './json/keystore.json'

const OP_CODE_TYPE = 'hex'
const acc_buf = Buffer.from(Data.acc_privateKey, OP_CODE_TYPE)
const updateAccount = (new_acc_list = {}) => {
  // console.log('new_acc_list', new_acc_list)
  acc_list_result = new_acc_list
}
const acc = new Account()
const accManager = new AccountManager(Data.acc_list, updateAccount)
let acc_list_result

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  let addr = await acc.dumpAddrFromPrivKey(Data.acc_privateKey)
  expect(addr).toEqual(Data.acc_addr)
  addr = await acc.dumpAddrFromPrivKey(acc_buf)
  expect(addr).toEqual(Data.acc_addr)
})

test('Dump Crypto Json from PrivateKey(string | Buffer)', async () => {
  let crypto_res = await acc.dumpCryptoFromPrivKey(
    Data.acc_privateKey,
    Data.acc_pwd
  )
  expect(typeof crypto_res).toEqual('object')
  crypto_res = await acc.dumpCryptoFromPrivKey(acc_buf, Data.acc_pwd)
  expect(typeof crypto_res).toEqual('object')
})

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  let pubKey = await acc.dumpPubKeyFromPrivKey(Data.acc_privateKey)
  expect(pubKey).toEqual(Data.acc_publicKey)
  pubKey = await acc.dumpPubKeyFromPrivKey(acc_buf)
  expect(pubKey).toEqual(Data.acc_publicKey)
})

test('Dump PublicKey Hash from PrivateKey(string | Buffer)', async () => {
  let pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(Data.acc_privateKey)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
  pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(acc_buf)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
})

test('Dump PublicKey Hash from Address', async () => {
  const pubKey_hash = await acc.dumpPubKeyHashFromAddr(Data.acc_addr)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
})

test('Dump PrivateKey from Crypto Json', async () => {
  const privateKey = await acc.dumpPrivKeyFromCrypto(
    Keystore.keystore,
    Data.acc_pwd
  )
  expect(privateKey).toEqual(Data.acc_privateKey)
})

test('Dump PublicKey Hash from Address', async () => {
  const pubKey_hash = await acc.dumpPubKeyHashFromAddr(Data.acc_addr)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
})

test('Create an Account', async () => {
  const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(Data.acc_pwd)
  expect(cryptoJSON.address).toEqual(P2PKH)
  await accManager.addToAccList(cryptoJSON, {
    name: Data.acc_name,
    P2PKH
  })
  /*   console.log('Acc addr:', JSON.stringify(P2PKH))
  console.log('Acc cryptoJSON:', JSON.stringify(cryptoJSON))
  const privkey = await acc.dumpPrivKeyFromCrypto(cryptoJSON, Data.acc_pwd)
  console.log('Acc privkey:', JSON.stringify(privkey)) */
  expect(acc_list_result[P2PKH].name).toEqual(Data.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})

test('Import an Account by PrivateKey', async () => {
  const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(
    Data.acc_pwd,
    Data.acc_privateKey
  )
  expect(cryptoJSON.address).toEqual(P2PKH)
  await accManager.addToAccList(cryptoJSON, {
    name: Data.acc_name,
    P2PKH
  })
  expect(acc_list_result[P2PKH].name).toEqual(Data.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})

test('Import an Account by Crypto Json', async () => {
  const privkey = await acc.dumpPrivKeyFromCrypto(
    Keystore.keystore,
    Data.acc_pwd
  )
  const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(Data.acc_pwd, privkey)
  expect(cryptoJSON.address).toEqual(P2PKH)
  await accManager.addToAccList(cryptoJSON, {
    name: Data.acc_name,
    P2PKH
  })
  expect(acc_list_result[P2PKH].name).toEqual(Data.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})
