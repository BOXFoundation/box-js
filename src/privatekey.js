import bitcore from 'bitcore-lib';
const {
  fromPrivateKey
} = require('./crypto/ecpair');
import {
  hash160,
  sha256
} from './crypto/hash';
import bs58 from 'bs58';

const prefix = {
  P2PKH: '1326',
  P2SH: '132b'
};

function getAddress(_this, prefixHex) {
  return function () {
    const sha256Content = prefixHex + this.pkh;
    const checksum = sha256(sha256(Buffer.from(sha256Content, 'hex'))).slice(
      0,
      4
    );
    const content = sha256Content.concat(checksum.toString('hex'));
    this.P2PKHAddress = bs58.encode(Buffer.from(content, 'hex'));
    return this.P2PKHAddress;
  }.bind(_this);
}

/**
 * @func creat_a_new_accont
 * @param [*privKey_Str]
 */
export function newPrivateKey(privKey_Str) {
  // console.log('==> newPrivateKey')
  // console.log('privKey_Str_1 :', privKey_Str)
  privKey_Str = privKey_Str.padStart(64, '0')
  // console.log('privKey_Str_2 :', privKey_Str)
  const newPrivateKey = new bitcore.PrivateKey(privKey_Str);
  newPrivateKey.signMsg = sigHash => {
    const eccPrivateKey = fromPrivateKey(Buffer.from(privKey_Str, 'hex'));
    return eccPrivateKey.sign(sigHash).sig;
  };
  newPrivateKey.pkh = getPublicAddress(newPrivateKey);
  newPrivateKey.toP2PKHAddress = getAddress(newPrivateKey, prefix.P2PKH);
  newPrivateKey.toP2SHAddress = getAddress(newPrivateKey, prefix.P2SH);

  return newPrivateKey;
}

export const getPublicAddress = privateKey => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString('hex');
};