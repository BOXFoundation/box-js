import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from '../util/crypto/keystore'
import { newPrivateKey } from '../util/crypto/privatekey'
import { Acc, Crypto } from './interface'

/**
 * @func get-cryptoJson-with-privateKey&password
 * @param [*privateKey] {toString, toP2PKHAddress}
 * @param [*pwd] string
 * @returns [cryptoJson]
 */
const getCrypto = (
  privateKey: {
    toString: (arg0: string) => string
    toP2PKHAddress: () => string
  },
  pwd: string
) => {
  return getCryptoJSON(privateKey, pwd)
}

export default class AccountFeature {
  // import an account by KeyStore
  impAccWithKeyStore: (ksJSON: { crypto: any }, pwd: string) => any
  acc_list: { [acc_addr: string]: Acc }
  newPrivateKey: any
  updateAccount: any

  constructor(
    acc_list: { [acc_addr: string]: Acc },
    updateAccount: object = (new_acc_list: object) => {
      return new_acc_list
    }
  ) {
    this.acc_list = acc_list
    this.impAccWithKeyStore = unlockPrivateKeyWithPassphrase
    this.newPrivateKey = newPrivateKey
    this.updateAccount = updateAccount
  }

  /**
   * @func get-Crypto-Account
   * @param [*pwd] string
   * @param [*privateKey_str] string
   * @returns {} Crypto
   * @memberof Account
   */
  getCryptoAcc(pwd: string, privateKey_str?: string): Crypto {
    const privateKey = newPrivateKey(privateKey_str)
    const cryptoJson = getCrypto(privateKey, pwd)
    return {
      P2PKH: privateKey.toP2PKHAddress(),
      P2SH: privateKey.toP2SHAddress(),
      privateKey,
      cryptoJson
    }
  }

  /**
   * @func add-new-wallet-to-walletList
   * @param {*cryptoJson} { address ... }
   * @memberof Account
   */
  addToAccList(cryptoJson: { address: string }, otherInfo: any): void {
    const address = cryptoJson.address
    const update_time = Date.now()
    if (this.acc_list[address]) {
      console.warn('This Account already existed. It will be rewrited...')
    }
    this.acc_list[address] = {
      cryptoJson,
      ...{
        update_time
      },
      ...otherInfo
    }
    this.updateAccount && this.updateAccount(this.acc_list)
  }

  sortAccList() {
    return Object.values(this.acc_list).sort(
      (a, b) => a.update_time - b.update_time
    )
  }
}
