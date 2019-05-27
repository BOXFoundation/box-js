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
var OP_CODE_TYPE = 'hex';
var prefix = {
    P2PKH: '1326',
    P2SH: '132b'
};
/**
 * @class [PrivateKey]
 * @constructs [privKey]
 */
var PrivateKey = /** @class */ (function () {
    function PrivateKey(privkey_str) {
        var _this = this;
        /**
         * @func get-CryptoJson-by-PrivateKey&Password
         * @param [*pwd] string
         * @returns [cryptoJSON]
         */
        this.getCryptoByPrivKey = function (pwd) {
            return crypto_json_1.default.getCryptoByPrivKey(_this.privKey, pwd);
        };
        /**
         * @export sign-Transaction-by-PrivKey
         * @param [*unsigned_tx] SignedTxByPrivKeyReq
         * @returns [tx]
         */
        this.signTxByPrivKey = function (unsigned_tx) { return __awaiter(_this, void 0, void 0, function () {
            var _a, tx, rawMsgs, _privKey, idx, sigHashBuf, eccPrivKey, signBuf, scriptSig;
            return __generator(this, function (_b) {
                _a = unsigned_tx.unsignedTx, tx = _a.tx, rawMsgs = _a.rawMsgs;
                _privKey = unsigned_tx.privKey;
                // vin handler
                for (idx = 0; idx < tx.vin.length; idx++) {
                    sigHashBuf = util_1.default.getSignHash(rawMsgs[idx]);
                    eccPrivKey = _privKey && ecpair_1.default.getECfromPrivKey(_privKey);
                    signBuf = eccPrivKey.sign(sigHashBuf).sig;
                    scriptSig = util_1.default.signatureScript(signBuf, this.privKey.toPublicKey().toBuffer());
                    tx.vin[idx].script_sig = scriptSig.toString('base64');
                }
                return [2 /*return*/, tx];
            });
        }); };
        this.getAddrByPrivKey = function (prefixHex) {
            var sha256Content = prefixHex + _this.privKey.pkh;
            var checksum = hash_1.default.sha256(hash_1.default.sha256(Buffer.from(sha256Content, OP_CODE_TYPE))).slice(0, 4);
            var content = sha256Content.concat(checksum.toString(OP_CODE_TYPE));
            return bs58_1.default.encode(Buffer.from(content, OP_CODE_TYPE));
        };
        this.getPubKeyHashByPrivKey = function () {
            return hash_1.default.hash160(_this.privKey.toPublicKey().toBuffer()).toString(OP_CODE_TYPE);
        };
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
