import 'jest'
import Account from '../src/script/boxd/account/account'
import Core from './core/data.json'

const updateAccount = (new_acc_list = {}) => {
  return new_acc_list
}

const acc = new Account(Core.acc_list, updateAccount)

test('Create an account', async () => {
  // test func [getCryptoAcc addToAccList]
  const { cryptoJson, P2PKH } = acc.getCryptoAcc(Core.acc_pwd)
  console.log('createWallet:', cryptoJson, P2PKH)
  const new_acc_list = acc.addToAccList(cryptoJson, {
    name: Core.acc_name,
    P2PKH
  })
  console.log('addToAccList:', new_acc_list)
})

/* test('Decode Token Address', async () => {
  // test func [decodeTokenAddr]
  const { opHash, index } = await decodeTokenAddr(Token.token_addr)
  expect(opHash).toEqual(Token.token_hash)
  expect(index).toEqual(Token.token_index)
}) */
