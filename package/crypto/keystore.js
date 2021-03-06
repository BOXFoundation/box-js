const scrypt = require('scrypt.js');
const randomBytes = require('randombytes');
const {
  getCiphertext,
  aesBlockSize,
  getMac
} = require('./aes');
const {
  hash160
} = require('./hash');

const _STRING_ENC_ = 'hex';

const scryptOpt = {
  n: 1 << 18,
  r: 8,
  p: 1,
  dklen: 32
};

/**
 * getDerivedKey with passphrase
 *
 * @param {string} passphrase
 * @param {Buffer} salt
 * @param {number} n
 * @param {number} r
 * @param {number} p
 * @param {number} dklen
 * @returns {Buffer}
 */
const getDerivedKey = (passphrase, salt, n, r, p, dklen) => {
  return scrypt(Buffer.from(passphrase), salt, n, r, p, dklen, progress => {
    // console.log('progress:', progress);
  });
};

/**
 * getCryptoJSON with privateKey and passphrase
 *
 * @param {privateKey} privateKey
 * @param {string} passphrase
 * @returns
 */
const getCryptoJSON = (privateKey, passphrase) => {
  if (!privateKey) {
    throw new Error('PrivateKey is require!');
  }

  if (!passphrase) {
    throw new Error('Passphrase is require!');
  }

  try {
    const privateKeyHexStr = privateKey.toString(_STRING_ENC_);
    const address = privateKey.toP2PKHAddress();

    const salt = randomBytes(32);
    const iv = randomBytes(aesBlockSize).toString(_STRING_ENC_);
    const derivedKey = getDerivedKey(
      passphrase,
      salt,
      scryptOpt.n,
      scryptOpt.r,
      scryptOpt.p,
      scryptOpt.dklen
    );

    const aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_);
    const sha256Key = derivedKey.slice(16).toString(_STRING_ENC_);
    const cipherText = getCiphertext(aesKey, privateKeyHexStr, iv);
    const mac = getMac(sha256Key, cipherText);

    return {
      id: '',
      address,
      crypto: {
        cipher: 'aes-128-ctr',
        ciphertext: cipherText,
        cipherparams: {
          iv
        },
        mac,
        kdfparams: {
          salt: salt.toString(_STRING_ENC_),
          ...scryptOpt
        }
      }
    };
  } catch (error) {
    error.message += '[Err:getCryptoJSON]';
    throw error;
  }
};

/**
 * unlockPrivateKeyWithPassphrase
 *
 * @param {object} ksJSON
 * @param {string} passphrase
 */
const unlockPrivateKeyWithPassphrase = (ksJSON, passphrase) => {
  if (!passphrase) {
    throw new Error('Passphrase is require!');
  }
  if (!ksJSON) {
    throw new Error('ksJSON is require!');
  }
  const cpt = ksJSON.crypto;
  const kdfParams = cpt.kdfparams;
  const saltBuffer = Buffer.from(kdfParams.salt, _STRING_ENC_);
  const derivedKey = getDerivedKey(
    passphrase,
    saltBuffer,
    kdfParams.n,
    kdfParams.r,
    kdfParams.p,
    kdfParams.dklen
  );

  const aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_);
  const sha256Key = derivedKey.slice(16, 32).toString(_STRING_ENC_);
  const mac = getMac(sha256Key, cpt.ciphertext);
  if (mac !== cpt.mac) {
    throw new Error('passphrase is error!');
  }
  const privateKeyHexStr = getCiphertext(
    aesKey,
    cpt.ciphertext,
    cpt.cipherparams.iv
  );
  if (!privateKeyHexStr) {
    throw new Error("Can't find privateKey!");
  }
  return privateKeyHexStr;
};

module.exports = {
  unlockPrivateKeyWithPassphrase,
  getCryptoJSON
};