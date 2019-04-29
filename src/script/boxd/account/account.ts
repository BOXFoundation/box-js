import { RpcError, Rpc } from '../util/util'
import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from '../util/crypto/keystore'
import { newPrivateKey } from '../util/crypto/privatekey'

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
    toString: (arg0: string) => void
    toP2PKHAddress: () => void
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

export default class Account extends Rpc {
  unlockPrivateKeyWithPassphrase: (
    ksJSON: { crypto: any },
    passphrase: any
  ) => any
  walletsMap: object
  newPrivateKey: any
  updateAccount: any

  constructor({ walletsMap = {}, updateAccount }) {
    super('endpoint', 'fetch')
    this.unlockPrivateKeyWithPassphrase = unlockPrivateKeyWithPassphrase
    this.walletsMap = walletsMap
    this.newPrivateKey = newPrivateKey
    this.updateAccount = updateAccount
  }

  /**
   * creat an account with a password
   *
   * @param {string} pass
   * @param {string} privateKeyHexStr
   * @returns
   * @memberof Wallet
   */
  createWallet(pass: any, privateKeyHexStr: string) {
    const privateKey = newPrivateKey(privateKeyHexStr)
    const cryptoJSON = getCrypto(privateKey, pass)
    return {
      P2PKH: privateKey.toP2PKHAddress(),
      P2SH: privateKey.toP2SHAddress(),
      privateKey,
      cryptoJSON
    }
  }

  /**
   * add new wallet to wallet list
   *
   * @param {object} cryptoJSON
   * @memberof Wallet
   */
  addToWalletList(cryptoJSON: { address: any }, otherInfo: any) {
    const address = cryptoJSON.address
    const update_time = Date.now()
    if (this.walletsMap[address]) {
      console.error('This wallet already existed. It will be rewrited!')
    }
    this.walletsMap[address] = {
      cryptoJSON,
      ...{
        update_time
      },
      ...otherInfo
    }
    this.updateAccount && this.updateAccount(this.walletsMap)
  }

  listWallets() {
    return Object.values(this.walletsMap).sort(
      (a, b) => a.update_time - b.update_time
    )
  }
}
