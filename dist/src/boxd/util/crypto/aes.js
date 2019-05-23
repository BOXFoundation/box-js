"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoJS = require('crypto-js');
var padding = CryptoJS.pad.NoPadding;
var mode = CryptoJS.mode.CTR;
var Aes;
(function (Aes) {
    /**
     * @export Encrypt-data
     * @param [*skey] string
     * @param [*text] string
     * @param [*iv] string
     */
    Aes.encrypt = function (skey, text, iv) {
        var key = CryptoJS.enc.Hex.parse(skey);
        var _iv = CryptoJS.enc.Hex.parse(iv);
        return CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(text), key, {
            mode: mode,
            iv: _iv,
            padding: padding
        });
    };
    /**
     * @export get-Ciphertext
     * @param [*skey] string
     * @param [*text] string
     * @param [*iv] string
     */
    Aes.getCiphertext = function (skey, text, iv) {
        return Aes.encrypt(skey, text, iv).ciphertext.toString(CryptoJS.enc.Hex);
    };
    /**
     * @export get-Mac
     * @param [key] string
     * @param [cipherText] string
     */
    Aes.getMac = function (key, cipherText) {
        return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(key + cipherText)).toString(CryptoJS.enc.Hex);
    };
})(Aes || (Aes = {}));
exports.default = Aes;
