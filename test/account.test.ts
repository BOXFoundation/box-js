import 'jest'
import Account from '../src/script/boxd/account/account'

const Core = require('./core/token.json')

const updateAccount = (new_acc_list = {}) => {
  return new_acc_list
}

const myWallet = new Account({
  Core.acc_list,
  updateAccount
})

test('Create an account', async () => {
  // test func [createWallet addToWalletList]
  const { cryptoJSON, P2PKH } = myWallet.createWallet(Core.acc_pwd)
  console.log('createWallet:', cryptoJSON, P2PKH)
  const new_acc_list = myWallet.addToWalletList(cryptoJSON, {
              name: Core.acc_name,
              P2PKH
            })
  console.log('addToWalletList:', new_acc_list)
})

/* test('Decode Token Address', async () => {
  // test func [decodeTokenAddr]
  const { opHash, index } = await decodeTokenAddr(Token.token_addr)
  expect(opHash).toEqual(Token.token_hash)
  expect(index).toEqual(Token.token_index)
}) */
