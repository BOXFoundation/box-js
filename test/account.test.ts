import 'jest'
import Account from '../src/boxd/account/account'
import AccountFeature from '../src/boxd/account/feature'
import Data from './json/data.json'
import KeystoreJson from './json/keystore.json'

const OP_CODE_TYPE = 'hex'
const acc_buf = Buffer.from(Data.acc_privateKey, OP_CODE_TYPE)
let acc_list_result

const updateAccount = (new_acc_list = {}) => {
  // console.log('new_acc_list', new_acc_list)
  acc_list_result = new_acc_list
}

const acc = new Account(Data.acc_list, updateAccount)
const feature = new AccountFeature(Data.acc_list, updateAccount)

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  // test func [dumpAddrFromPrivKey]
  let addr = await acc.dumpAddrFromPrivKey(Data.acc_privateKey)
  expect(addr).toEqual(Data.acc_addr)
  addr = await acc.dumpAddrFromPrivKey(acc_buf)
  expect(addr).toEqual(Data.acc_addr)
})

test('Dump KeyStore from PrivateKey(string | Buffer)', async () => {
  // test func [dumpKeyStoreFromPrivKey]
  let keyStore_res = await acc.dumpKeyStoreFromPrivKey(
    Data.acc_privateKey,
    Data.acc_pwd
  )
  expect(typeof keyStore_res).toEqual('object')
  keyStore_res = await acc.dumpKeyStoreFromPrivKey(acc_buf, Data.acc_pwd)
  expect(typeof keyStore_res).toEqual('object')
})

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  // test func [dumpPubKeyFromPrivKey]
  let pubKey = await acc.dumpPubKeyFromPrivKey(Data.acc_privateKey)
  expect(pubKey).toEqual(Data.acc_publicKey)
  pubKey = await acc.dumpPubKeyFromPrivKey(acc_buf)
  expect(pubKey).toEqual(Data.acc_publicKey)
})

test('Dump PublicKey Hash from PrivateKey(string | Buffer)', async () => {
  // test func [dumpPubKeyHashFromPrivKey]
  let pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(Data.acc_privateKey)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
  pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(acc_buf)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
})

test('Dump PublicKey Hash from Address', async () => {
  // test func [dumpPubKeyHashFromAddr]
  const pubKey_hash = await acc.dumpPubKeyHashFromAddr(Data.acc_addr)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
})

test('Dump PrivateKey from KeyStore', async () => {
  // test func [dumpPrivKeyFromKeyStore]
  const privateKey = await acc.dumpPrivKeyFromKeyStore(
    KeystoreJson,
    Data.acc_pwd
  )
  expect(privateKey).toEqual(Data.acc_privateKey)
})

test('Dump PublicKey Hash from Address', async () => {
  // test func [dumpPubKeyHashFromAddr]
  const pubKey_hash = await acc.dumpPubKeyHashFromAddr(Data.acc_addr)
  expect(pubKey_hash).toEqual(Data.acc_publickey_hash)
})

test('Create an account', async () => {
  // test func [getCryptoAcc]
  const { cryptoJson, P2PKH } = await feature.getCryptoAcc(Data.acc_pwd)
  expect(cryptoJson.address).toEqual(P2PKH)
  // test func [addToAccList]
  await feature.addToAccList(cryptoJson, {
    name: Data.acc_name,
    P2PKH
  })
  expect(acc_list_result[P2PKH].name).toEqual(Data.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})

test('Import an account by KeyStore', async () => {})

test('Import an account by PrivateKey', async () => {
  // test func [getCryptoAcc]
  const { cryptoJson, P2PKH } = await feature.getCryptoAcc(
    Data.acc_pwd,
    Data.acc_privateKey
  )
  expect(cryptoJson.address).toEqual(P2PKH)
  // test func [addToAccList]
  await feature.addToAccList(cryptoJson, {
    name: Data.acc_name,
    P2PKH
  })
  expect(acc_list_result[P2PKH].name).toEqual(Data.acc_name)
  expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
})
