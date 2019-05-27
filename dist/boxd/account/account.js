"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_json_1 = __importDefault(require("../util/crypto/crypto-json"));
var aes_1 = __importDefault(require("../util/crypto/aes"));
var privatekey_1 = __importDefault(require("../util/crypto/privatekey"));
var verify_1 = __importDefault(require("../util/verify"));
var OP_CODE_TYPE = 'hex';
/**
 * @class [Account]
 */
var Account = /** @class */ (function () {
    function Account() {
    }
    /**
     * @func Dump-P2PKH-Address-from-PrivateKey
     * @param [*privKey] string | Buffer
     * @returns [P2PKH_Address] string
     * @memberof Account
     */
    Account.prototype.dumpAddrFromPrivKey = function (privKey) {
        try {
            if (privKey instanceof Buffer) {
                privKey = privKey.toString(OP_CODE_TYPE);
            }
            if (verify_1.default.isPrivate(privKey)) {
                var privK = new privatekey_1.default(privKey);
                return privK.privKey.toP2PKHAddress;
            }
        }
        catch (err) {
            console.log('dumpAddrFromPrivKey Error !');
            throw new Error(err);
        }
    };
    /**
     * @func Dump-PublicKey-from-PrivateKey
     * @param [*privKey] string | Buffer
     * @returns [PublicKey] string
     * @memberof Account
     */
    Account.prototype.dumpPubKeyFromPrivKey = function (privKey) {
        try {
            if (privKey instanceof Buffer) {
                privKey = privKey.toString(OP_CODE_TYPE);
            }
            if (verify_1.default.isPrivate(privKey)) {
                var privK = new privatekey_1.default(privKey);
                return privK.privKey.toPublicKey().toString(OP_CODE_TYPE);
            }
        }
        catch (err) {
            console.log('dumpPubKeyFromPrivKey Error !');
            throw new Error(err);
        }
    };
    /**
     * @func Dump-Crypto-from-PrivateKey
     * @param [*privKey] string | Buffer
     * @param [*pwd] string
     * @returns [CryptoJson] CryptoJson
     * @memberof Account
     */
    Account.prototype.dumpCryptoFromPrivKey = function (privKey, pwd) {
        try {
            if (privKey instanceof Buffer) {
                privKey = privKey.toString(OP_CODE_TYPE);
            }
            if (verify_1.default.isPrivate(privKey)) {
                var privK = new privatekey_1.default(privKey);
                return privK.getCryptoByPrivKey(pwd);
            }
        }
        catch (err) {
            console.log('dumpKeyStoreFromPrivKey Error !');
            throw new Error(err);
        }
    };
    /**
     * @func Dump-PublicKey-Hash-from-PrivateKey
     * @param [*privKey] string | Buffer
     * @returns [PublicKey_hash] string
     * @memberof Account
     */
    Account.prototype.dumpPubKeyHashFromPrivKey = function (privKey) {
        try {
            if (privKey instanceof Buffer) {
                privKey = privKey.toString(OP_CODE_TYPE);
            }
            if (verify_1.default.isPrivate(privKey)) {
                var privK = new privatekey_1.default(privKey);
                return privK.privKey.pkh;
            }
        }
        catch (err) {
            console.log('dumpPubKeyHashFromPrivKey Error !');
            throw new Error(err);
        }
    };
    /**
     * @func dump-PublicKey-Hash-from-Address
     * @param [*addr] string
     * @returns [PublicKey] string
     * @memberof Account
     */
    Account.prototype.dumpPubKeyHashFromAddr = function (addr) {
        try {
            var pubKey_hash = verify_1.default.isAddr(addr);
            if (pubKey_hash) {
                return pubKey_hash.slice(2).toString(OP_CODE_TYPE);
            }
        }
        catch (err) {
            console.log('dumpPubKeyHashFromAddr Error !');
            throw new Error(err);
        }
    };
    /**
     * @func Dump-PrivateKey-from-Crypto
     * @param [*key_store] CryptoJson
     * @param [*pwd] string
     * @returns [PrivateKey] string
     * @memberof Account
     */
    Account.prototype.dumpPrivKeyFromCrypto = function (cryptoJSON, pwd) {
        return __awaiter(this, void 0, void 0, function () {
            var cpt, kdfParams, saltBuffer, derivedKey, aesKey, sha256Key, mac, privateKeyHexStr, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        cpt = cryptoJSON.crypto;
                        kdfParams = cpt.kdfparams;
                        saltBuffer = Buffer.from(kdfParams.salt, OP_CODE_TYPE);
                        derivedKey = crypto_json_1.default.getDerivedKey(pwd, saltBuffer, kdfParams.n, kdfParams.r, kdfParams.p, kdfParams.dklen);
                        aesKey = derivedKey.slice(0, 16).toString(OP_CODE_TYPE);
                        sha256Key = derivedKey.slice(16, 32).toString(OP_CODE_TYPE);
                        mac = aes_1.default.getMac(sha256Key, cpt.ciphertext);
                        if (mac !== cpt.mac) {
                            throw new Error('Wrong passphrase !');
                        }
                        return [4 /*yield*/, aes_1.default.getCiphertext(aesKey, cpt.ciphertext, cpt.cipherparams.iv)];
                    case 1:
                        privateKeyHexStr = _a.sent();
                        if (!privateKeyHexStr) {
                            throw new Error('Private key not found !');
                        }
                        return [2 /*return*/, privateKeyHexStr];
                    case 2:
                        err_1 = _a.sent();
                        console.log('dumpPrivKeyFromKeyStore Error !');
                        throw new Error(err_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @func get-Crypto-Account
     * @param [*pwd] string
     * @param [*privateKey_str] string
     * @returns {} Crypto
     * @memberof Account
     */
    Account.prototype.getCryptoByPwd = function (pwd, privKey) {
        if (privKey && privKey instanceof Buffer) {
            privKey = privKey.toString(OP_CODE_TYPE);
        }
        var privK = new privatekey_1.default(privKey);
        var cryptoJSON = privK.getCryptoByPrivKey(pwd);
        return {
            P2PKH: privK.privKey.toP2PKHAddress,
            P2SH: privK.privKey.toP2SHAddress,
            privateKey: privK.privKey,
            cryptoJSON: cryptoJSON
        };
    };
    return Account;
}());
exports.default = Account;
