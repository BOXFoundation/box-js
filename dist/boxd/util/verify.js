"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");var _typeof5 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var secp256k1_1 = __importDefault(require("secp256k1"));
var bs58_1 = __importDefault(require("bs58"));
var hash_1 = __importDefault(require("../util/crypto/hash"));
var _typeof4 = function _typeof2(obj) {
  if (typeof Symbol === 'function' && (0, _typeof5.default)(Symbol.iterator) === 'symbol') {
    _typeof4 = function _typeof2(obj) {
      return (0, _typeof5.default)(obj);
    };
  } else
  {
    _typeof4 = function _typeof2(obj) {
      return obj &&
      typeof Symbol === 'function' &&
      obj.constructor === Symbol &&
      obj !== Symbol.prototype ?
      'symbol' : (0, _typeof5.default)(
      obj);
    };
  }
  return _typeof4(obj);
};
var Verify;
(function (Verify) {
  /**
                     * @func get_check_sum
                     * @param [*hex]
                     * @returns [check_sum]
                     */
  Verify.getCheckSum = function (hex) {
    if (hex instanceof Buffer) {
      return hash_1.default.sha256(hash_1.default.sha256(hex)).slice(0, 4);
    } else
    {
      return hash_1.default.sha256(hash_1.default.sha256(Buffer.from(hex, 'hex'))).slice(0, 4);
    }
  };
  /**
      * @func check_is_private_key
      * @param [*privKey]
      * @returns [boolean]
      */
  Verify.isPrivate = function (privKey) {
    if (secp256k1_1.default.privateKeyVerify(Buffer.from(privKey, 'hex'))) {
      return privKey;
    } else
    {
      return false;
    }
  };
  /**
      * @func check_is_BOX_address
      * @param [*addr]
      * @returns [pubkey_hash]
      */
  Verify.isBoxAddr = function (addr) {
    if (!['b1', 'b2', 'b3', 'b5'].includes(addr.substring(0, 2))) {
      throw new Error('[isBoxAddr] Incorrect address format !');
    }
    var decoded = bs58_1.default.decode(addr);
    if (decoded.length < 4) {
      throw new Error("[isBoxAddr] Address length = " + decoded.length + ": is too short !");
    }
    var len = decoded.length;
    var pubkey_hash = decoded.slice(0, len - 4);
    var checksum = Verify.getCheckSum(pubkey_hash);
    if (!checksum.equals(decoded.slice(len - 4))) {
      throw new Error('[isBoxAddr] Incorrect address format !');
    }
    return pubkey_hash;
  };
  Verify._typeof = function (obj) {
    if (typeof Symbol === 'function' &&
    _typeof4(Symbol.iterator) === 'symbol') {
      module.exports = Verify._typeof = function _typeof(obj) {
        return _typeof4(obj);
      };
    } else
    {
      Verify._typeof = function _typeof(obj) {
        return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype ?
        'symbol' :
        _typeof4(obj);
      };
    }
    return Verify._typeof(obj);
  };
})(Verify || (Verify = {}));
exports.default = Verify;