import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from './crypto/keystore';

import { newPrivateKey } from './privatekey';

export default class Wallet {
  constructor() {
    this.unlockPrivateKeyWithPassphrase = unlockPrivateKeyWithPassphrase;
    this.walletList = {};
  }

  /**
   * creat an account with a password
   *
   * @param {string} pass
   * @returns
   * @memberof Wallet
   */
  async createWallet(pass) {
    const privateKey = newPrivateKey();
    const cryptoJSON = this.getCrypto(privateKey, pass);
    this.addToWalletList(cryptoJSON);
    return {
      privateKey,
      cryptoJSON
    };
  }

  /**
   * get cryptoJSON with privateKey and password
   *
   * @param {string} privateKey
   * @param {string} pass
   * @returns
   * @memberof Wallet
   */
  getCrypto(privateKey, pass) {
    const cryptoJSON = getCryptoJSON(privateKey, pass);
    const proviteKeyStr = unlockPrivateKeyWithPassphrase(cryptoJSON, pass);
    const anotherPrivateKey = newPrivateKey(proviteKeyStr);

    if (anotherPrivateKey.isEqualTo(privateKey)) {
      return cryptoJSON;
    } else {
      throw new Error('Generate cryptoJSON failed!');
    }
  }

  /**
   * add new wallet to wallet list
   *
   * @param {object} cryptoJSON
   * @memberof Wallet
   */
  addToWalletList(cryptoJSON) {
    const address = cryptoJSON.address;
    if (this.walletList[address]) {
      console.error('This wallet already existed. It will be rewrited!');
    }
    this.walletList[address] = { cryptoJSON };
  }

  listWallets() {
    return Object.keys(this.walletList);
  }
}
