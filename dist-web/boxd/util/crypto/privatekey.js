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
var bitcore_lib_1 = __importDefault(require("bitcore-lib"));
var bs58_1 = __importDefault(require("bs58"));
var hash_1 = __importDefault(require("./hash"));
var ecpair_1 = __importDefault(require("./ecpair"));
var util_1 = __importDefault(require("../util"));
var crypto_json_1 = __importDefault(require("./crypto-json"));
var prefix = {
    P2PKH: '1326',
    P2SH: '132b'
};
/**
 * @class [PrivateKey]
 * @constructs privKey
 */
var PrivateKey = /** @class */ (function () {
    function PrivateKey(privkey_str) {
        var _this = this;
        /**
         * @func Get_CryptoJson_by_PrivateKey_&_Password
         * @param [*pwd]
         * @returns [crypto.json]
         * @memberof PrivateKey   *
         */
        this.getCryptoByPrivKey = function (pwd) {
            return crypto_json_1.default.getCryptoByPrivKey(_this.privKey, pwd);
        };
        /**
         * @export Sign_Transaction_by_PrivKey
         * @param [*unsigned_tx]
         * @branch [next__sendTx_||_sendRawTx]
         * @returns [tx]
         * @memberof PrivateKey   *
         */
        this.signTxByPrivKey = function (unsigned_tx) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tx, rawMsgs, _privKey, idx, sigHashBuf, eccPrivKey, signBuf, scriptSig, scriptsig_bs64;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = unsigned_tx.unsignedTx, tx = _a.tx, rawMsgs = _a.rawMsgs;
                        _privKey = unsigned_tx.privKey;
                        idx = 0;
                        _b.label = 1;
                    case 1:
                        if (!(idx < tx.vin.length)) return [3 /*break*/, 4];
                        sigHashBuf = util_1.default.getSignHash(rawMsgs[idx]);
                        eccPrivKey = _privKey && ecpair_1.default.getECfromPrivKey(_privKey);
                        signBuf = eccPrivKey.sign(sigHashBuf).sig;
                        return [4 /*yield*/, util_1.default.signatureScript(signBuf, this.privKey.toPublicKey().toBuffer())];
                    case 2:
                        scriptSig = _b.sent();
                        scriptsig_bs64 = scriptSig.toString('base64');
                        tx.vin[idx].script_sig = scriptsig_bs64;
                        if (unsigned_tx.protocalTx) {
                            unsigned_tx.protocalTx.getVinList()[idx].setScriptSig(scriptsig_bs64);
                        }
                        _b.label = 3;
                    case 3:
                        idx++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (unsigned_tx.protocalTx) {
                            return [2 /*return*/, unsigned_tx.protocalTx.serializeBinary().toString('hex')];
                        }
                        else {
                            return [2 /*return*/, tx];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * @func get_Address_by_PrivKey
         * @memberof PrivateKey
         */
        this.getAddrByPrivKey = function (prefixHex) {
            var sha256Content = prefixHex + _this.privKey.pkh;
            var checksum = hash_1.default.sha256(hash_1.default.sha256(Buffer.from(sha256Content, 'hex'))).slice(0, 4);
            var content = sha256Content.concat(checksum.toString('hex'));
            return bs58_1.default.encode(Buffer.from(content, 'hex'));
        };
        /**
         * @func get_PubKeyHash_by_PrivKey
         * @memberof PrivateKey
         */
        this.getPubKeyHashByPrivKey = function () {
            return hash_1.default.hash160(_this.privKey.toPublicKey().toBuffer()).toString('hex');
        };
        console.log('privkey_str :', privkey_str);
        if (privkey_str) {
            privkey_str = privkey_str.padStart(64, '0');
        }
        this.privKey = new bitcore_lib_1.default.PrivateKey(privkey_str);
        this.privKey.signMsg = function (sigHash) {
            var eccPrivateKey = privkey_str && ecpair_1.default.getECfromPrivKey(privkey_str);
            return eccPrivateKey.sign(sigHash).sig;
        };
        this.privKey.pkh = this.getPubKeyHashByPrivKey();
        this.privKey.toP2PKHAddress = this.getAddrByPrivKey(prefix.P2PKH);
        this.privKey.toP2SHAddress = this.getAddrByPrivKey(prefix.P2SH);
    }
    return PrivateKey;
}());
exports.default = PrivateKey;
