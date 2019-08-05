import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'

export default class AccountManager {
  public acc_list: { [acc_addr: string]: UtilInterface.Account }
  public update_func

  public constructor(
    acc_list: { [acc_addr: string]: UtilInterface.Account },
    update_func: object = (new_acc_list: object) => {
      return new_acc_list
    }
  ) {
    this.acc_list = acc_list
    this.update_func = update_func
  }

  /**
   * @func New_PrivateKey_Object
   * @param [*privkey]
   * @returns [privateKey]
   * @memberof AccountManager
   */
  public newPrivateKey(privkey: string): object {
    const privk = new PrivateKey(privkey)
    return privk.privKey
  }

  /**
   * @func Add_New_Account_to_Account_List
   * @param {*cryptoJSON}
   * @memberof AccountManager
   */
  public addToAccList(cryptoJSON: UtilInterface.Crypto, otherInfo): void {
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
    this.update_func && this.update_func(this.acc_list)
  }

  /**
   * @func Sort_Account_List
   * @returns [account_list]
   * @memberof AccountManager
   */
  public sortAccList(): object {
    return Object.values(this.acc_list).sort(
      (a, b) => a.updateTime - b.updateTime
    )
  }
}
