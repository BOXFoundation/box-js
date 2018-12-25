import bitcore from 'bitcore-lib';

/**
 * creat a new accont
 *
 * @param {string} privateKeyStr
 */
export const newPrivateKey = privateKeyStr => {
  return new bitcore.PrivateKey(privateKeyStr);
};

newPrivateKey();
