"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tiny_secp256k1_1 = __importDefault(require("tiny-secp256k1"));
var bs58_1 = __importDefault(require("bs58"));
var hash_1 = __importDefault(require("../util/crypto/hash"));
var OP_CODE_TYPE = 'hex';
var getCheckSum = function (hex) {
    if (hex instanceof Buffer) {
        return hash_1.default.sha256(hash_1.default.sha256(hex)).slice(0, 4);
    }
    else {
        return hash_1.default.sha256(hash_1.default.sha256(Buffer.from(hex, OP_CODE_TYPE))).slice(0, 4);
    }
};
var _typeof2 = function (obj) {
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
        _typeof2 = function _typeof2(obj) {
            return typeof obj;
        };
    }
    else {
        _typeof2 = function _typeof2(obj) {
            return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj;
        };
    }
    return _typeof2(obj);
};
var Verify;
(function (Verify) {
    Verify.isPrivate = function (privKey) {
        if (tiny_secp256k1_1.default.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
            return privKey;
        }
        else {
            throw new Error('The private key entered is not a valid one !');
        }
    };
    Verify.isAddr = function (addr) {
        if (addr.substring(0, 2) !== ('b1' || 'b2' || 'b3')) {
            throw new Error('Incorrect address format !');
        }
        var decoded = bs58_1.default.decode(addr);
        if (decoded.length < 4) {
            throw new Error("Address length = " + decoded.length + ": is too short !");
        }
        var len = decoded.length;
        var pubkey_hash = decoded.slice(0, len - 4);
        var checksum = getCheckSum(pubkey_hash);
        if (!checksum.equals(decoded.slice(len - 4))) {
            throw new Error('Incorrect address format !');
        }
        return pubkey_hash;
    };
    Verify.isPublic = function (privKey) {
        console.log('privKey:', privKey);
    };
    Verify.isPublicHash = function (pubkey_hash) {
        console.log('pubkey_hash:', pubkey_hash);
    };
    Verify._typeof = function (obj) {
        if (typeof Symbol === 'function' &&
            _typeof2(Symbol.iterator) === 'symbol') {
            module.exports = Verify._typeof = function _typeof(obj) {
                return _typeof2(obj);
            };
        }
        else {
            Verify._typeof = function _typeof(obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : _typeof2(obj);
            };
        }
        return Verify._typeof(obj);
    };
})(Verify || (Verify = {}));
exports.default = Verify;
