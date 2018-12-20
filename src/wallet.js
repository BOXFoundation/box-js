import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from './crypto/keystore';

import { newPrivateKey } from './privatekey';

export default class Wallet {
  constructor() {
    this.walletList = {};
  }

  async createWallet() {
    const privateKey = newPrivateKey();
    this.addPrivateKeyToWalletList(privateKey);
  }

  saveToJson(privateKey, pass) {
    const cryptoJSON = getCryptoJSON(privateKey, pass);
    const proviteKeyStr = unlockPrivateKeyWithPassphrase(cryptoJSON, pass);
    const anotherPrivateKey = newPrivateKey(proviteKeyStr);

    if (anotherPrivateKey.isEqualTo(privateKey)) {
      return cryptoJSON;
    } else {
      throw new Error('Generate cryptoJSON failed!');
    }
  }

  async importWalletFromJson(json, pass) {
    const proviteKeyStr = unlockPrivateKeyWithPassphrase(json, pass);
    const privateKey = newPrivateKey(proviteKeyStr);
    this.addPrivateKeyToWalletList(privateKey);
  }

  addPrivateKeyToWalletList(privateKey) {
    const address = privateKey.toAddress();
    if (this.privateKeys[address]) {
      console.error('This privateKeys already existed. It will be rewrited!');
    }
    this.walletList[address] = { privateKey };
  }

  listWallets() {
    return Object.keys(this.walletList);
  }

  // async listTransactions() {}
}
