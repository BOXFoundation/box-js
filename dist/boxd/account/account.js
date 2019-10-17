"use strict";
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {try {step(generator.next(value));} catch (e) {reject(e);}}
    function rejected(value) {try {step(generator["throw"](value));} catch (e) {reject(e);}}
    function step(result) {result.done ? resolve(result.value) : new P(function (resolve) {resolve(result.value);}).then(fulfilled, rejected);}
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = { label: 0, sent: function sent() {if (t[0] & 1) throw t[1];return t[1];}, trys: [], ops: [] },f,y,t,g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {return this;}), g;
  function verb(n) {return function (v) {return step([n, v]);};}
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) {try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:case 1:t = op;break;
          case 4:_.label++;return { value: op[1], done: false };
          case 5:_.label++;y = op[1];op = [0];continue;
          case 7:op = _.ops.pop();_.trys.pop();continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {_ = 0;continue;}
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {_.label = op[1];break;}
            if (op[0] === 6 && _.label < t[1]) {_.label = t[1];t = op;break;}
            if (t && _.label < t[2]) {_.label = t[2];_.ops.push(op);break;}
            if (t[2]) _.ops.pop();
            _.trys.pop();continue;}

        op = body.call(thisArg, _);
      } catch (e) {op = [6, e];y = 0;} finally {f = t = 0;}}
    if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_json_1 = __importDefault(require("../util/crypto/crypto-json"));
var aes_1 = __importDefault(require("../util/crypto/aes"));
var privatekey_1 = __importDefault(require("../util/crypto/privatekey"));
var verify_1 = __importDefault(require("../util/verify"));
var util_1 = __importDefault(require("../util/util"));
var Account;
(function (Account) {
  var _this = this;
  /**
                     * @func Dump_P2PKH_address_from_privateKey
                     * @param [*privKey]
                     * @returns [P2PKH_address]
                     * @memberof Account
                     */
  Account.dumpAddrFromPrivKey = function (privKey) {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex');
    }
    if (verify_1.default.isPrivate(privKey)) {
      var privK = new privatekey_1.default(privKey);
      return privK.privKey.toP2PKHAddress;
    } else
    {
      throw new Error('Private key format error !');
    }
  };
  /**
      * @func Dump_publicKey_from_privateKey
      * @param [*privKey]
      * @returns [publicKey]
      * @memberof Account
      */
  Account.dumpPubKeyFromPrivKey = function (privKey) {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex');
    }
    if (verify_1.default.isPrivate(privKey)) {
      var privK = new privatekey_1.default(privKey);
      return privK.privKey.toPublicKey().toString('hex');
    } else
    {
      throw new Error('Private key format error !');
    }
  };
  /**
      * @func Dump_cryptoJson_from_privateKey
      * @param [*privKey]
      * @param [*pwd]
      * @returns [cryptoJson]
      * @memberof Account
      */
  Account.dumpCryptoFromPrivKey = function (privKey, pwd) {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex');
    }
    if (verify_1.default.isPrivate(privKey)) {
      var privK = new privatekey_1.default(privKey);
      return privK.getCryptoByPrivKey(pwd);
    } else
    {
      throw new Error('Private key format error !');
    }
  };
  /**
      * @func Dump_publicKey_hash_from_privateKey
      * @param [*privKey]
      * @returns [publicKey_hash]
      * @memberof Account
      */
  Account.dumpPubKeyHashFromPrivKey = function (privKey) {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex');
    }
    if (verify_1.default.isPrivate(privKey)) {
      var privK = new privatekey_1.default(privKey);
      return privK.privKey.pkh;
    } else
    {
      throw new Error('Private key format error !');
    }
  };
  /**
      * @func Dump_publicKey_hash_from_address
      * @param [*addr]
      * @returns [publicKey]
      * @memberof Account
      */
  Account.dumpPubKeyHashFromAddr = function (addr) {
    return util_1.default.box2HexAddr(addr);
  };
  /**
      * @func Dump_privateKey_from_crypto.json
      * @param [*cryptoJSON]
      * @param [*pwd]
      * @returns [privKey]
      * @memberof Account
      */
  Account.dumpPrivKeyFromCrypto = function (cryptoJSON, pwd) {return __awaiter(_this, void 0, void 0, function () {
      var cpt, kdfParams, saltBuffer, derivedKey, aesKey, sha256Key, mac, privateKeyHexStr;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            cpt = cryptoJSON.crypto;
            kdfParams = cpt.kdfparams;
            saltBuffer = Buffer.from(kdfParams.salt, 'hex');
            derivedKey = crypto_json_1.default.getDerivedKey(pwd, saltBuffer, kdfParams.n, kdfParams.r, kdfParams.p, kdfParams.dklen);
            aesKey = derivedKey.slice(0, 16).toString('hex');
            sha256Key = derivedKey.slice(16, 32).toString('hex');
            mac = aes_1.default.getMac(sha256Key, cpt.ciphertext);
            if (mac !== cpt.mac) {
              throw new Error('Wrong passphrase !');
            }
            return [4 /*yield*/, aes_1.default.getCiphertext(aesKey, cpt.ciphertext, cpt.cipherparams.iv)];
          case 1:
            privateKeyHexStr = _a.sent();
            if (privateKeyHexStr) {
              return [2 /*return*/, privateKeyHexStr];
            } else
            {
              throw new Error('Private Key not found !');
            }
            return [2 /*return*/];}

      });
    });};
  /**
           * @func Get_account_crypto_by_password
           * @param [*pwd]
           * @param [*privKey]
           * @returns [cryptoJson]
           * @memberof Account
           */
  Account.getCryptoByPwd = function (pwd, privKey) {
    if (privKey) {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString('hex');
      }
      if (!verify_1.default.isPrivate(privKey)) {
        throw new Error('Private key format error !');
      }
    }
    var privK = new privatekey_1.default(privKey);
    var cryptoJSON = privK.getCryptoByPrivKey(pwd);
    return {
      P2PKH: privK.privKey.toP2PKHAddress,
      P2SH: privK.privKey.toP2SHAddress,
      privateKey: privK.privKey,
      cryptoJSON: cryptoJSON };

  };
})(Account || (Account = {}));
exports.default = Account;