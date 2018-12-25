const { it, describe } = require('mocha');

const cryptoJson = require('./data/crypto.json');
const { getCiphertext } = require('../src/crypto/aes');
const {
  unlockPrivateKeyWithPassphrase,
  getCryptoJSON
} = require('../src/crypto/keystore');
const { newPrivateKey } = require('../src/privatekey');

const testPrivateKey =
  '1253763c15ab327823c15dface658c7f269512987d750cb50d4d84094c63da6c';
const testAddr = '';
const testPass = '123';

describe('Test privateKey', () => {
  it(`They should be same:`, () => {
    unlockPrivateKeyWithPassphrase(cryptoJson, testPass).should.equal(
      testPrivateKey
    );
  });

  it(`Two keys should be same:`, () => {
    const newKey = newPrivateKey(testPrivateKey);
    newKey.toString().should.equal(testPrivateKey);
  });

  it(`The address should be same:`, () => {
    const newKey = newPrivateKey(testPrivateKey);
    const json = getCryptoJSON(newKey, testPass);
    console.log('json:', json);
    console.log(unlockPrivateKeyWithPassphrase(json, testPass));
    console.log(testPrivateKey);
    // newKey.toString().should.equal(testPrivateKey);
  });
});
