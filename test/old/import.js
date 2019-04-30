const {
  unlockPrivateKeyWithPassphrase,
  getCryptoJSON
} = require('../src/crypto/keystore');
const { newPrivateKey } = require('../src/privatekey');

const testPrivateKey =
  '1253763c15ab327823c15dface658c7f269512987d750cb50d4d84094c63da6c';
const testPass = '123';

const newKey = newPrivateKey(testPrivateKey);
const json = getCryptoJSON(newKey, testPass);
console.log('json:', json);
console.log(unlockPrivateKeyWithPassphrase(json, testPass));
console.log(testPrivateKey);
