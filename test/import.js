const { it, describe } = require('mocha');

const cryptoJson = require('./data/crypto.json');
const { getCiphertext } = require('../src/crypto/aes');
const { unlockPrivateKeyWithPassphrase } = require('../src/crypto/keystore');
const { newPrivateKey } = require('../src/privatekey');

const testPrivateKey =
  '1253763c15ab327823c15dface658c7f269512987d750cb50d4d84094c63da6c';

describe('Test privateKey', () => {
  it(`They should be same:`, () => {
    unlockPrivateKeyWithPassphrase(cryptoJson, '123').should.equal(
      testPrivateKey
    );
  });
  it(`Two keys should be same:`, () => {
    const newKey = newPrivateKey(testPrivateKey);
    newKey.toString().should.equal(testPrivateKey);
  });
});
