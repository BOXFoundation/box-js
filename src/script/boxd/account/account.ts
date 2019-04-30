import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from '../util/crypto/keystore'
import { newPrivateKey } from '../util/crypto/privatekey'
import { Acc, Crypto } from './core'

/**
 * get cryptoJSON with privateKey and password
 *
 * @param {any} privateKey
 * @param {string} pass
 * @returns
 * @memberof Wallet
 */
const getCrypto = (
  privateKey: {
    toString: (arg0: string) => string
    toP2PKHAddress: () => string
  },
  pass: any
) => {
  return getCryptoJSON(privateKey, pass)
  // const cryptoJSON = getCryptoJSON(privateKey, pass);
  // const proviteKeyStr = unlockPrivateKeyWithPassphrase(cryptoJSON, pass);
  // const anotherPrivateKey = newPrivateKey(proviteKeyStr);

  // if (isEqualTo(anotherPrivateKey, privateKey)) {
  //   return cryptoJSON;
  // } else {
  //   throw new Error('Generate cryptoJSON failed!');
  // }
}

export default class Account {
  unlockPrivateKeyWithPassphrase: (
    ksJSON: { crypto: any },
    passphrase: any
  ) => any
  acc_list: { [acc_addr: string]: Acc }
  newPrivateKey: any
  updateAccount: any

  constructor(
    acc_list: { [acc_addr: string]: Acc },
    updateAccount: object = (new_acc_list: object) => {
      return new_acc_list
    }
  ) {
    this.unlockPrivateKeyWithPassphrase = unlockPrivateKeyWithPassphrase
    this.acc_list = acc_list
    this.newPrivateKey = newPrivateKey
    this.updateAccount = updateAccount
  }

  /**
   * @func get-Crypto-Account
   * @param [*pwd] string
   * @param [*privateKey_str] string
   * @returns {} Crypto
   * @memberof Wallet
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
   * @param {object} cryptoJSON
   * @memberof Wallet
   */
  addToAccList(cryptoJSON: { address: any }, otherInfo: any): void {
    const address = cryptoJSON.address
    const update_time = Date.now()
    if (this.acc_list[address]) {
      console.error('This wallet already existed. It will be rewrited!')
    }
    this.acc_list[address] = {
      cryptoJSON,
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
