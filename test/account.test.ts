import 'jest'
import Account from '../src/boxd/account/account'
import AccountManager from '../src/boxd/account/account-manager'
import Mock from './json/mock.json'
import Keystore from './json/keystore.json'

let acc_list_result
const OP_CODE_TYPE = 'hex'
const acc_buf = Buffer.from(Mock.acc_privateKey, OP_CODE_TYPE) // private key (buffer ed)
const updateAccount = (new_acc_list = {}) => {
  // console.log('new_acc_list :', new_acc_list)
  acc_list_result = new_acc_list
}
const acc = new Account()
const accManager = new AccountManager(Mock.acc_list, updateAccount)

test('Dump publicKey from privateKey (string | Buffer)', async () => {
  try {
    expect(await acc.dumpAddrFromPrivKey(Mock.acc_privateKey)).toEqual(
      Mock.acc_addr
    )
    expect(await acc.dumpAddrFromPrivKey(acc_buf)).toEqual(Mock.acc_addr)
  } catch (err) {
    console.error('Dump publicKey from privateKey Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump cryptoJson from privateKey & password (string | Buffer)', async () => {
  try {
    expect(
      typeof (await acc.dumpCryptoFromPrivKey(
        Mock.acc_privateKey,
        Mock.acc_pwd
      ))
    ).toEqual('object')
    expect(
      typeof (await acc.dumpCryptoFromPrivKey(acc_buf, Mock.acc_pwd))
    ).toEqual('object')
  } catch (err) {
    console.error('Dump cryptoJson from privateKey Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump publicKey from privateKey (string | Buffer)', async () => {
  try {
    expect(await acc.dumpPubKeyFromPrivKey(Mock.acc_privateKey)).toEqual(
      Mock.acc_publicKey
    )
    expect(await acc.dumpPubKeyFromPrivKey(acc_buf)).toEqual(Mock.acc_publicKey)
  } catch (err) {
    console.error('Dump publicKey from privateKey Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump publicKey hash from privateKey (string | Buffer)', async () => {
  try {
    expect(await acc.dumpPubKeyHashFromPrivKey(Mock.acc_privateKey)).toEqual(
      Mock.acc_publickey_hash
    )
    expect(await acc.dumpPubKeyHashFromPrivKey(acc_buf)).toEqual(
      Mock.acc_publickey_hash
    )
  } catch (err) {
    console.error('Dump publicKey hash from privateKey Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump publicKey hash from address', async () => {
  try {
    expect(await acc.dumpPubKeyHashFromAddr(Mock.acc_addr)).toEqual(
      Mock.acc_publickey_hash
    )
  } catch (err) {
    console.error('Dump publicKey hash from address Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump privateKey from cryptoJson', async () => {
  try {
    expect(
      await acc.dumpPrivKeyFromCrypto(Keystore.keystore, Mock.acc_pwd)
    ).toEqual(Mock.acc_privateKey)
  } catch (err) {
    console.error('Dump privateKey from cryptoJson Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump publicKey hash from address', async () => {
  try {
    expect(await acc.dumpPubKeyHashFromAddr(Mock.acc_addr)).toEqual(
      Mock.acc_publickey_hash
    )
  } catch (err) {
    console.error('Dump publicKey hash from address Error :', err)
    expect(0).toBe(1)
  }
})

test('Create an account', async () => {
  try {
    // create a crypto without privateKey
    const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(Mock.acc_pwd)
    expect(cryptoJSON.address).toEqual(P2PKH)
    await accManager.addToAccList(cryptoJSON, {
      name: Mock.acc_name,
      P2PKH
    })
    expect(acc_list_result[P2PKH].name).toEqual(Mock.acc_name)
    expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
  } catch (err) {
    console.error('Create an account Error :', err)
    expect(0).toBe(1)
  }
})

test('Import an account by PrivateKey', async () => {
  try {
    // import a crypto with privateKey
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
  } catch (err) {
    console.error('Import an account by PrivateKey Error :', err)
    expect(0).toBe(1)
  }
})

test('Import an account by CryptoJson', async () => {
  try {
    const { cryptoJSON, P2PKH } = await acc.getCryptoByPwd(
      Mock.acc_pwd,
      await acc.dumpPrivKeyFromCrypto(Keystore.keystore, Mock.acc_pwd)
    )
    expect(cryptoJSON.address).toEqual(P2PKH)
    await accManager.addToAccList(cryptoJSON, {
      name: Mock.acc_name,
      P2PKH
    })
    expect(acc_list_result[P2PKH].name).toEqual(Mock.acc_name)
    expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH)
  } catch (err) {
    console.error('Import an account by CryptoJson Error :', err)
    expect(0).toBe(1)
  }
})
