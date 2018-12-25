import bitcore from 'bitcore-lib';
import { hash160 } from './crypto/hash';

/**
 * creat a new accont
 *
 * @param {string} privateKeyStr
 */
export const newPrivateKey = privateKeyStr => {
  return new bitcore.PrivateKey(privateKeyStr);
};

export const getAddress = privateKey => {
  const address = privateKey.toAddress().toString();
  return hash160(Buffer.from(address)).toString('hex');
};
