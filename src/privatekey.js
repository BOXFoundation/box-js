import bitcore from 'bitcore-lib';
import { hash160, sha256 } from './crypto/hash';
import bs58 from 'bs58';

const P2PKHSetting = {
  prefix: '1326'
};

function toP2PKHAddress() {
  const sha256Content = P2PKHSetting.prefix + this.pkh;
  const checksum = sha256(sha256(Buffer.from(sha256Content, 'hex'))).slice(
    0,
    4
  );
  const content = sha256Content.concat(checksum.toString('hex'));
  this.P2PKHAddress = bs58.encode(Buffer.from(content, 'hex'));
  return this.P2PKHAddress;
}

/**
 * creat a new accont
 *
 * @param {string} privateKeyStr
 */
export function newPrivateKey(privateKeyStr) {
  const newPrivateKey = new bitcore.PrivateKey(privateKeyStr);
  newPrivateKey.pkh = getAddress(newPrivateKey);
  newPrivateKey.toP2PKHAddress = toP2PKHAddress;
  return newPrivateKey;
}

export const getAddress = privateKey => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString('hex');
};
