import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from './crypto/keystore';

import { newPrivateKey } from './privatekey';

const isEqualTo = (a, b) => {
  const aStr = a.toString();
  const bStr = b.toString();
  console.log('a:', aStr);
  console.log('b:', bStr);

  return aStr === bStr;
};

export default class Wallet {
  constructor(walletsMap) {
    this.unlockPrivateKeyWithPassphrase = unlockPrivateKeyWithPassphrase;
    this.walletsMap = {};
  }

  /**
   * creat an account with a password
   *
   * @param {string} pass
   * @param {string} privateKeyHexStr
   * @returns
   * @memberof Wallet
   */
  createWallet(pass, privateKeyHexStr) {
    const privateKey = newPrivateKey(privateKeyHexStr);
    const cryptoJSON = this.getCrypto(privateKey, pass);
    return {
      privateKey,
      cryptoJSON
    };
  }

  /**
   * get cryptoJSON with privateKey and password
   *
   * @param {any} privateKey
   * @param {string} pass
   * @returns
   * @memberof Wallet
   */
  getCrypto(privateKey, pass) {
    return getCryptoJSON(privateKey, pass);
    // const cryptoJSON = getCryptoJSON(privateKey, pass);
    // const proviteKeyStr = unlockPrivateKeyWithPassphrase(cryptoJSON, pass);
    // const anotherPrivateKey = newPrivateKey(proviteKeyStr);

    // if (isEqualTo(anotherPrivateKey, privateKey)) {
    //   return cryptoJSON;
    // } else {
    //   throw new Error('Generate cryptoJSON failed!');
    // }
  }

  /**
   * add new wallet to wallet list
   *
   * @param {object} cryptoJSON
   * @memberof Wallet
   */
  addToWalletList(cryptoJSON, otherInfo) {
    const address = cryptoJSON.address;
    const update_time = Date.now();
    if (this.walletsMap[address]) {
      console.error('This wallet already existed. It will be rewrited!');
    }
    this.walletsMap[address] = { cryptoJSON, ...{ update_time }, ...otherInfo };
  }

  listWallets() {
    return Object.values(this.walletsMap).sort(
      (a, b) => a.update_time - b.update_time
    );
  }
}
