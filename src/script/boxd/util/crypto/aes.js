const CryptoJS = require('crypto-js');
const padding = CryptoJS.pad.NoPadding;
const mode = CryptoJS.mode.CTR;

// The AES block size in bytes. see go/1.11.2/libexec/src/crypto/aes/cipher.go
const aesBlockSize = 16;

/**
 * encrypt data
 *
 * @param {string} text hex string
 * @param {string} skey hex string
 * @param {string} iv hex string
 */
const encrypt = (skey, text, iv) => {
  var key = CryptoJS.enc.Hex.parse(skey);
  var _iv = CryptoJS.enc.Hex.parse(iv);

  return CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(text), key, {
    mode,
    iv: _iv,
    padding
  });
};

/**
 * get Ciphertext
 *
 * @param {string} text hex string
 * @param {string} skey hex string
 * @param {string} iv hex string
 */
const getCiphertext = (skey, text, iv) =>
  encrypt(skey, text, iv).ciphertext.toString(CryptoJS.enc.Hex);

/**
 *
 *
 * @param {string} cipherText hex string
 * @param {string} key hex string
 * @returns
 */
const getMac = (key, cipherText) => {
  return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(key + cipherText)).toString(
    CryptoJS.enc.Hex
  );
};

module.exports = {
  getMac,
  aesBlockSize,
  encrypt,
  getCiphertext
};
