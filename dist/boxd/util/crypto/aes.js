"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_js_1 = __importDefault(require("crypto-js"));
var padding = crypto_js_1.default.pad.NoPadding;
var mode = crypto_js_1.default.mode.CTR;
var Aes;
(function (Aes) {
    /**
     * @export Encrypt-data
     * @param [*skey] string
     * @param [*text] string
     * @param [*iv] string
     */
    Aes.encrypt = function (skey, text, iv) {
        var key = crypto_js_1.default.enc.Hex.parse(skey);
        var _iv = crypto_js_1.default.enc.Hex.parse(iv);
        return crypto_js_1.default.AES.encrypt(crypto_js_1.default.enc.Hex.parse(text), key, {
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
        return Aes.encrypt(skey, text, iv).ciphertext.toString(crypto_js_1.default.enc.Hex);
    };
    /**
     * @export get-Mac
     * @param [key] string
     * @param [cipherText] string
     */
    Aes.getMac = function (key, cipherText) {
        return crypto_js_1.default.SHA256(crypto_js_1.default.enc.Hex.parse(key + cipherText)).toString(crypto_js_1.default.enc.Hex);
    };
})(Aes || (Aes = {}));
exports.default = Aes;
