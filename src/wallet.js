import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from './crypto/keystore';

import {
  newPrivateKey
} from './privatekey';

/* const isEqualTo = (a, b) => {
  const aStr = a.toString();
  const bStr = b.toString();
  console.log('a:', aStr);
  console.log('b:', bStr);

  return aStr === bStr;
}; */

export default class Wallet {
  constructor({
    walletsMap = {},
    onUpdate
  }) {
    this.unlockPrivateKeyWithPassphrase = unlockPrivateKeyWithPassphrase;
    this.walletsMap = walletsMap;
    this.newPrivateKey = newPrivateKey;
    this.onUpdate = onUpdate;
  }






}