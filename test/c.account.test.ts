import 'jest'
import Mock from '../static/json/mock.json'
import Keystore from '../static/json/keystore.json'
import Account from '../package/boxd/account/account'
import AccountManager from '../package/boxd/account/account-manager'

let acc_list_result
const acc_buf = Buffer.from(Mock.privatekey, 'hex') // private key <buffer>

const update_func = (new_acc_list = {}) => {
  // console.log('New account list :', new_acc_list)
  acc_list_result = new_acc_list
}
const accManager = new AccountManager(Mock.acc_list, update_func)

test('Dump public-key from private-key <string | Buffer>', async () => {
  try {
    expect(await Account.dumpAddrFromPrivKey(Mock.privatekey)).toEqual(
      Mock.addr
    )
    expect(await Account.dumpAddrFromPrivKey(acc_buf)).toEqual(Mock.addr)
  } catch (err) {
    console.error('Dump public-key from private-key Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump crypto-json from (private-key + password) <string | Buffer>', async () => {
  try {
    const crypto_json_str = await Account.dumpCryptoFromPrivKey(
      Mock.privatekey,
      Mock.acc_pwd
    )
    const crypto_json_buf = await Account.dumpCryptoFromPrivKey(
      acc_buf,
      Mock.acc_pwd
    )

    expect(crypto_json_str.address).toEqual(crypto_json_buf.address)
  } catch (err) {
    console.error('Dump crypto-json from (private-key + password) Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump public-key from private-key (string | Buffer)', async () => {
  try {
    expect(await Account.dumpPubKeyFromPrivKey(Mock.privatekey)).toEqual(
      Mock.publickey
    )
    expect(await Account.dumpPubKeyFromPrivKey(acc_buf)).toEqual(Mock.publickey)
  } catch (err) {
    console.error('Dump publicKey from privateKey Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump publicKey hash from privateKey (string | Buffer)', async () => {
  try {
    expect(await Account.dumpPubKeyHashFromPrivKey(Mock.privatekey)).toEqual(
      Mock.publickey_hash
    )
    expect(await Account.dumpPubKeyHashFromPrivKey(acc_buf)).toEqual(
      Mock.publickey_hash
    )
  } catch (err) {
    console.error('Dump publicKey hash from privateKey Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump publicKey hash from address', async () => {
  try {
    expect(await Account.dumpPubKeyHashFromAddr(Mock.addr)).toEqual(
      Mock.publickey_hash
    )
  } catch (err) {
    console.error('Dump publicKey hash from address Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump privateKey from cryptoJson', async () => {
  try {
    expect(
      await Account.dumpPrivKeyFromCrypto(Keystore.ks, Mock.acc_pwd)
    ).toEqual(Mock.privatekey)
  } catch (err) {
    console.error('Dump privateKey from cryptoJson Error :', err)
    expect(0).toBe(1)
  }
})

test('Dump publicKey hash from address', async () => {
  try {
    expect(await Account.dumpPubKeyHashFromAddr(Mock.addr)).toEqual(
      Mock.publickey_hash
    )
  } catch (err) {
    console.error('Dump publicKey hash from address Error :', err)
    expect(0).toBe(1)
  }
})

test('Create an account', async () => {
  try {
    // create a crypto without privateKey
    const { cryptoJSON, P2PKH } = await Account.getCryptoByPwd(Mock.acc_pwd)
    console.log('New account :', cryptoJSON)
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
    const { cryptoJSON, P2PKH } = await Account.getCryptoByPwd(
      Mock.acc_pwd,
      Mock.privatekey
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
    const { cryptoJSON, P2PKH } = await Account.getCryptoByPwd(
      Mock.acc_pwd,
      await Account.dumpPrivKeyFromCrypto(Keystore.ks, Mock.acc_pwd)
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
