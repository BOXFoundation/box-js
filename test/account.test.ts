import 'jest'
import Account from '../src/boxd/account/account'
import Core from './json/data.json'
import Keystore from './json/keystore.json'

const OP_CODE_TYPE = 'hex'
const acc_buf = Buffer.from(Core.acc_privateKey_1, OP_CODE_TYPE)
let result_acc_list

const updateAccount = (new_acc_list = {}) => {
  // console.log('new_acc_list', new_acc_list)
  result_acc_list = new_acc_list
}

const acc = new Account(Core.acc_list, updateAccount)

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  // test func [dumpAddrFromPrivKey]
  const hex = Buffer.from(Core.acc_privateKey_1, OP_CODE_TYPE)
  console.log('hex:', hex)
  let addr = await acc.dumpAddrFromPrivKey(Core.acc_privateKey_1)
  expect(addr).toEqual(Core.acc_addr)
  addr = await acc.dumpAddrFromPrivKey(acc_buf)
  expect(addr).toEqual(Core.acc_addr)
})

test('Dump KeyStore from PrivateKey(string | Buffer)', async () => {
  // test func [dumpKeyStoreFromPrivKey]
  let keyStore_res = await acc.dumpKeyStoreFromPrivKey(
    Core.acc_privateKey_1,
    Core.acc_pwd
  )
  expect(typeof keyStore_res).toEqual('object')
  keyStore_res = await acc.dumpKeyStoreFromPrivKey(acc_buf, Core.acc_pwd)
  expect(typeof keyStore_res).toEqual('object')
})

test('Dump PublicKey from PrivateKey(string | Buffer)', async () => {
  // test func [dumpPubKeyFromPrivKey]
  let pubKey = await acc.dumpPubKeyFromPrivKey(Core.acc_privateKey_1)
  expect(pubKey).toEqual(Core.acc_publicKey)
  pubKey = await acc.dumpPubKeyFromPrivKey(acc_buf)
  expect(pubKey).toEqual(Core.acc_publicKey)
})

test('Dump PublicKey Hash from PrivateKey(string | Buffer)', async () => {
  // test func [dumpPubKeyHashFromPrivKey]
  let pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(Core.acc_privateKey_1)
  expect(pubKey_hash).toEqual(Core.acc_publickey_hash)
  pubKey_hash = await acc.dumpPubKeyHashFromPrivKey(acc_buf)
  expect(pubKey_hash).toEqual(Core.acc_publickey_hash)
})

test('Dump PublicKey Hash from Address', async () => {
  // test func [dumpPubKeyHashFromAddr]
  const pubKey_hash = acc.dumpPubKeyHashFromAddr(Core.acc_addr)
  expect(pubKey_hash).toEqual(Core.acc_publickey_hash)
})

test('Dump PrivateKey from KeyStore', async () => {
  // test func [dumpPrivKeyFromKeyStore]
  const privateKey = acc.dumpPrivKeyFromKeyStore(Keystore, Core.acc_pwd)
  expect(privateKey).toEqual(Core.acc_privateKey)
})

test('Dump PublicKey Hash from Address', async () => {
  // test func [dumpPubKeyHashFromAddr]
  const pubKey_hash = acc.dumpPubKeyHashFromAddr(Core.acc_addr)
  expect(pubKey_hash).toEqual(Core.acc_publickey_hash)
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
