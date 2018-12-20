import bitcore from 'bitcore-lib';

/**
 * creat a new accont
 *
 * @param {string} passphrase
 * @param {string} key
 */
export const newPrivateKey = (passphrase, privateKeyStr) => {
  const privateKey = new bitcore.PrivateKey(privateKeyStr);

  privateKey.prototype.isEqualTo = anotherPrivateKey => {
    return privateKey.toString('hex') === anotherPrivateKey.toString('hex');
  };

  return privateKey;
};
