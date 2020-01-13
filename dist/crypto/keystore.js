"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {(0, _defineProperty2.default)(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}var scrypt = require('scrypt.js');
var randomBytes = require('randombytes');var _require =




require('./aes'),getCiphertext = _require.getCiphertext,aesBlockSize = _require.aesBlockSize,getMac = _require.getMac;var _require2 =


require('./hash'),hash160 = _require2.hash160;

var _STRING_ENC_ = 'hex';

var scryptOpt = {
  n: 1 << 18,
  r: 8,
  p: 1,
  dklen: 32 };


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
var getDerivedKey = function getDerivedKey(passphrase, salt, n, r, p, dklen) {
  return scrypt(Buffer.from(passphrase), salt, n, r, p, dklen, function (progress) {
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
var getCryptoJSON = function getCryptoJSON(privateKey, passphrase) {
  if (!privateKey) {
    throw new Error('PrivateKey is require!');
  }

  if (!passphrase) {
    throw new Error('Passphrase is require!');
  }

  try {
    var privateKeyHexStr = privateKey.toString(_STRING_ENC_);
    var address = privateKey.toP2PKHAddress();

    var salt = randomBytes(32);
    var iv = randomBytes(aesBlockSize).toString(_STRING_ENC_);
    var derivedKey = getDerivedKey(
    passphrase,
    salt,
    scryptOpt.n,
    scryptOpt.r,
    scryptOpt.p,
    scryptOpt.dklen);


    var aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_);
    var sha256Key = derivedKey.slice(16).toString(_STRING_ENC_);
    var cipherText = getCiphertext(aesKey, privateKeyHexStr, iv);
    var mac = getMac(sha256Key, cipherText);

    return {
      id: '',
      address: address,
      crypto: {
        cipher: 'aes-128-ctr',
        ciphertext: cipherText,
        cipherparams: {
          iv: iv },

        mac: mac,
        kdfparams: _objectSpread({
          salt: salt.toString(_STRING_ENC_) },
        scryptOpt) } };



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
var unlockPrivateKeyWithPassphrase = function unlockPrivateKeyWithPassphrase(ksJSON, passphrase) {
  if (!passphrase) {
    throw new Error('Passphrase is require!');
  }
  if (!ksJSON) {
    throw new Error('ksJSON is require!');
  }
  var cpt = ksJSON.crypto;
  var kdfParams = cpt.kdfparams;
  var saltBuffer = Buffer.from(kdfParams.salt, _STRING_ENC_);
  var derivedKey = getDerivedKey(
  passphrase,
  saltBuffer,
  kdfParams.n,
  kdfParams.r,
  kdfParams.p,
  kdfParams.dklen);


  var aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_);
  var sha256Key = derivedKey.slice(16, 32).toString(_STRING_ENC_);
  var mac = getMac(sha256Key, cpt.ciphertext);
  if (mac !== cpt.mac) {
    throw new Error('passphrase is error!');
  }
  var privateKeyHexStr = getCiphertext(
  aesKey,
  cpt.ciphertext,
  cpt.cipherparams.iv);

  if (!privateKeyHexStr) {
    throw new Error("Can't find privateKey!");
  }
  return privateKeyHexStr;
};

module.exports = {
  unlockPrivateKeyWithPassphrase: unlockPrivateKeyWithPassphrase,
  getCryptoJSON: getCryptoJSON };