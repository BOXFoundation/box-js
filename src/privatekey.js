import bitcore from 'bitcore-lib';
import { hash160 } from './crypto/hash';

/**
 * creat a new accont
 *
 * @param {string} privateKeyStr
 */
export const newPrivateKey = privateKeyStr => {
  const newKey = new bitcore.PrivateKey(privateKeyStr);
  return newKey;
};

export const getAddress = privateKey => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString('hex');
};
