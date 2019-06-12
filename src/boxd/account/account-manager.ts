import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'

export default class AccountManager {
  public acc_list: { [acc_addr: string]: UtilInterface.Account }
  public updateAccount: any

  public constructor(
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
  public newPrivateKey(privkey: string): object {
    const privk = new PrivateKey(privkey)
    return privk.privKey
  }

  /**
   * @func Add-New-Account-to-Account-List
   * @param {*cryptoJSON} { address ... }
   * @returns void
   * @memberof AccountManager
   */
  public addToAccList(cryptoJSON: UtilInterface.Crypto, otherInfo: any): void {
    const address = cryptoJSON.address
    const updateTime = Date.now()
    /*     console.log('acc_list:', this.acc_list)
    console.log('address:', address) */
    if (this.acc_list[address]) {
      console.warn('This Account already existed. It will be rewrited...')
    }
    this.acc_list[address] = {
      cryptoJSON,
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
  public sortAccList(): object {
    return Object.values(this.acc_list).sort(
      (a, b) => a.updateTime - b.updateTime
    )
  }
}
