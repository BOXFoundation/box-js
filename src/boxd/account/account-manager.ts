import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'

export default class AccountManager {
  // impAccWithKeyStore: (ksJSON: { crypto: any }, pwd: string) => any todo
  acc_list: { [acc_addr: string]: UtilInterface.Account }
  updateAccount: any

  constructor(
    acc_list: { [acc_addr: string]: UtilInterface.Account },
    updateAccount: object = (new_acc_list: object) => {
      return new_acc_list
    }
  ) {
    this.acc_list = acc_list
    this.updateAccount = updateAccount
  }

  /**
   * @func New-PrivateKey-Object
   * @param [*privkey] string
   * @returns [PrivateKey] object
   * @memberof AccountManager
   */
  newPrivateKey(privkey: string): object {
    const privk = new PrivateKey(privkey)
    return privk.privKey
  }

  /**
   * @func Add-New-Account-to-Account-List
   * @param {*cryptoJson} { address ... }
   * @returns void
   * @memberof AccountManager
   */
  addToAccList(cryptoJson: UtilInterface.Crypto, otherInfo: any): void {
    const address = cryptoJson.address
    const updateTime = Date.now()
    if (this.acc_list[address]) {
      console.warn('This Account already existed. It will be rewrited...')
    }
    this.acc_list[address] = {
      cryptoJson,
      ...{
        updateTime
      },
      ...otherInfo
    }
    this.updateAccount && this.updateAccount(this.acc_list)
  }

  /**
   * @func Sort-Account-List
   * @returns [AccountList] object
   * @memberof AccountManager
   */
  sortAccList(): object {
    return Object.values(this.acc_list).sort(
      (a, b) => a.updateTime - b.updateTime
    )
  }
}
