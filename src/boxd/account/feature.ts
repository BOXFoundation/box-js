import { unlockPrivateKeyWithPassphrase } from '../util/crypto/keystore'
import { PrivateKey } from '../util/crypto/privatekey'
import AccRequest from './request'

export default class AccountFeature {
  // import an account by KeyStore
  impAccWithKeyStore: (ksJSON: { crypto: any }, pwd: string) => any
  acc_list: { [acc_addr: string]: AccRequest.Acc }
  newPrivateKey: any
  updateAccount: any

  constructor(
    acc_list: { [acc_addr: string]: AccRequest.Acc },
    updateAccount: object = (new_acc_list: object) => {
      return new_acc_list
    }
  ) {
    this.acc_list = acc_list
    this.impAccWithKeyStore = unlockPrivateKeyWithPassphrase
    this.updateAccount = updateAccount
  }

  /**
   * @func get-Crypto-Account
   * @param [*pwd] string
   * @param [*privateKey_str] string
   * @returns {} Crypto
   * @memberof Account
   */
  getCryptoAcc(pwd: string, privateKey_str?: string) {
    const privK = new PrivateKey(privateKey_str)
    const cryptoJson = privK.getCrypto(pwd)
    return {
      P2PKH: privK.privKey.toP2PKHAddress,
      P2SH: privK.privKey.toP2SHAddress,
      privateKey: privK.privKey,
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
