"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scrypt_js_1 = __importDefault(require("scrypt.js"));
var randombytes_1 = __importDefault(require("randombytes"));
var aes_1 = __importDefault(require("./aes"));
var _STRING_ENC_ = 'hex';
// The AES block size in bytes. see go/1.11.2/libexec/src/crypto/aes/cipher.go
var aesBlockSize = 16;
var scryptOpt = {
    n: 1 << 18,
    r: 8,
    p: 1,
    dklen: 32
};
var CryptoJson;
(function (CryptoJson) {
    /**
     * @export get-DerivedKey-by-Passphrase
     * @param [passphrase] string
     * @param [salt] Buffer
     * @param [n] number
     * @param [r] number
     * @param [p] number
     * @param [dklen] number
     * @returns Buffer
     */
    CryptoJson.getDerivedKey = function (passphrase, salt, n, r, p, dklen) {
        return scrypt_js_1.default(Buffer.from(passphrase), salt, n, r, p, dklen, function (progress) {
            console.log('progress:', progress);
        });
    };
    /**
     * @export get-Crypto-by-PrivateKey&Passphrase
     * @param [privateKey] privateKey
     * @param [passphrase] string
     * @returns [CryptoJson] CryptoJson
     */
    CryptoJson.getCryptoByPrivKey = function (privateKey, passphrase) {
        if (!privateKey) {
            throw new Error('PrivateKey is require!');
        }
        if (!passphrase) {
            throw new Error('Passphrase is require!');
        }
        try {
            var privateKeyHexStr = privateKey.toString(_STRING_ENC_);
            var address = privateKey.toP2PKHAddress;
            var salt = randombytes_1.default(32);
            var iv = randombytes_1.default(aesBlockSize).toString(_STRING_ENC_);
            var derivedKey = CryptoJson.getDerivedKey(passphrase, salt, scryptOpt.n, scryptOpt.r, scryptOpt.p, scryptOpt.dklen);
            var aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_);
            var sha256Key = derivedKey.slice(16).toString(_STRING_ENC_);
            var cipherText = aes_1.default.getCiphertext(aesKey, privateKeyHexStr, iv);
            var mac = aes_1.default.getMac(sha256Key, cipherText);
            return {
                id: '',
                address: address,
                crypto: {
                    cipher: 'aes-128-ctr',
                    ciphertext: cipherText,
                    cipherparams: {
                        iv: iv
                    },
                    mac: mac,
                    kdfparams: __assign({ salt: salt.toString(_STRING_ENC_) }, scryptOpt)
                }
            };
        }
        catch (err) {
            err.message += '[Err:getCryptoJSON]';
            throw new Error(err);
        }
    };
    /**
     * @export unlock-PrivateKey-by-Passphrase
     * @param [ksJSON] object
     * @param [passphrase] string
     * @returns [privateKeyHexStr]
     */
    CryptoJson.unlockPrivateKeyWithPassphrase = function (ksJSON, passphrase) {
        if (!passphrase) {
            throw new Error('Passphrase is require!');
        }
        if (!ksJSON) {
            throw new Error('ksJSON is require!');
        }
        var cpt = ksJSON.crypto;
        var kdfParams = cpt.kdfparams;
        var saltBuffer = Buffer.from(kdfParams.salt, _STRING_ENC_);
        var derivedKey = CryptoJson.getDerivedKey(passphrase, saltBuffer, kdfParams.n, kdfParams.r, kdfParams.p, kdfParams.dklen);
        var aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_);
        var sha256Key = derivedKey.slice(16, 32).toString(_STRING_ENC_);
        var mac = aes_1.default.getMac(sha256Key, cpt.ciphertext);
        if (mac !== cpt.mac) {
            throw new Error('passphrase is error!');
        }
        var privateKeyHexStr = aes_1.default.getCiphertext(aesKey, cpt.ciphertext, cpt.cipherparams.iv);
        if (!privateKeyHexStr) {
            throw new Error("Can't find privateKey!");
        }
        return privateKeyHexStr;
    };
})(CryptoJson || (CryptoJson = {}));
exports.default = CryptoJson;
