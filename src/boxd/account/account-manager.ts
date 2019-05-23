import UtilInterface from '../util/interface'

export default class AccountManager {
  // impAccWithKeyStore: (ksJSON: { crypto: any }, pwd: string) => any todo
  acc_list: { [acc_addr: string]: UtilInterface.Account }
  newPrivateKey: any
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
   * @func add-new-wallet-to-walletList
   * @param {*cryptoJson} { address ... }
   * @memberof Account
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

  sortAccList() {
    return Object.values(this.acc_list).sort(
      (a, b) => a.updateTime - b.updateTime
    )
  }
}
