"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var fetch_1 = require("../util/fetch");
var account_1 = __importDefault(require("../account/account"));
var privatekey_1 = __importDefault(require("../util/crypto/privatekey"));
var api_1 = __importDefault(require("../core/api"));
// import UtilInterface from '../util/interface'
/**
 * @class [Feature]
 * @extends Fetch
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
var Feature = /** @class */ (function (_super) {
    __extends(Feature, _super);
    function Feature(_fetch, endpoint, fetch_type) {
        return _super.call(this, _fetch, endpoint, fetch_type) || this;
    }
    /**
     * @export Sign-Transaction-by-CryptoJson
     * @param [*unsigned_tx] SignedTxByCryptoReq
     * @returns [tx] TxResponse.TX
     */
    Feature.prototype.signTxByCrypto = function (unsigned_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var acc, privKey, unsigned_tx_p, privk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        acc = new account_1.default();
                        return [4 /*yield*/, acc.dumpPrivKeyFromCrypto(unsigned_tx.crypto, unsigned_tx.pwd)];
                    case 1:
                        privKey = _a.sent();
                        unsigned_tx_p = {
                            privKey: privKey,
                            unsignedTx: unsigned_tx.unsignedTx
                        };
                        privk = new privatekey_1.default(privKey);
                        return [2 /*return*/, privk.signTxByPrivKey(unsigned_tx_p)];
                }
            });
        });
    };
    /**
     * @export Make-Box-Transaction-by-Crypto
     * @param [*org_tx] MakeBoxTxByCryptoReq
     * @returns [Promise] { hash: string }
     */
    Feature.prototype.makeBoxTxByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var cor, unsigned_tx, signed_tx, tx_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cor = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, cor.makeUnsignedTx(org_tx.tx)];
                    case 1:
                        unsigned_tx = _a.sent();
                        return [4 /*yield*/, this.signTxByCrypto({
                                unsignedTx: {
                                    tx: unsigned_tx.tx,
                                    rawMsgs: unsigned_tx.rawMsgs
                                },
                                crypto: org_tx.crypto,
                                pwd: org_tx.pwd
                            })];
                    case 2:
                        signed_tx = _a.sent();
                        return [4 /*yield*/, cor.sendTx(signed_tx)];
                    case 3:
                        tx_result = _a.sent();
                        return [2 /*return*/, tx_result];
                }
            });
        });
    };
    /**
     * @export Make-Split-Transaction-by-Crypto
     * @param [*org_tx] MakeSplitTxByCryptoReq
     * @returns [Promise] { hash: string }
     */
    Feature.prototype.makeSplitTxByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var cor, unsigned_tx, signed_tx, tx_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cor = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, cor.makeUnsignedSplitAddrTx(org_tx.tx)];
                    case 1:
                        unsigned_tx = _a.sent();
                        return [4 /*yield*/, this.signTxByCrypto({
                                unsignedTx: {
                                    tx: unsigned_tx.tx,
                                    rawMsgs: unsigned_tx.rawMsgs
                                },
                                crypto: org_tx.crypto,
                                pwd: org_tx.pwd
                            })];
                    case 2:
                        signed_tx = _a.sent();
                        return [4 /*yield*/, cor.sendTx(signed_tx)];
                    case 3:
                        tx_result = _a.sent();
                        return [2 /*return*/, tx_result];
                }
            });
        });
    };
    /**
     * @export Issue-Token-by-Crypto
     * @param [*org_tx] IssueTokenByCryptoReq
     * @returns [Promise] { hash: string }
     */
    Feature.prototype.issueTokenByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var cor, unsigned_tx, signed_tx, tx_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cor = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, cor.makeUnsignedTokenIssueTx(org_tx.tx)];
                    case 1:
                        unsigned_tx = _a.sent();
                        return [4 /*yield*/, this.signTxByCrypto({
                                unsignedTx: {
                                    tx: unsigned_tx.tx,
                                    rawMsgs: unsigned_tx.rawMsgs
                                },
                                crypto: org_tx.crypto,
                                pwd: org_tx.pwd
                            })];
                    case 2:
                        signed_tx = _a.sent();
                        return [4 /*yield*/, cor.sendTx(signed_tx)];
                    case 3:
                        tx_result = _a.sent();
                        return [2 /*return*/, tx_result];
                }
            });
        });
    };
    /**
     * @export Make-Token-Transaction-by-Crypto
     * @param [*org_tx] MakeTokenTxByCryptoReq
     * @returns [Promise] { hash: string }
     */
    Feature.prototype.makeTokenTxByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var cor, unsigned_tx, signed_tx, tx_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cor = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, cor.makeUnsignedTokenTx(org_tx.tx)];
                    case 1:
                        unsigned_tx = _a.sent();
                        return [4 /*yield*/, this.signTxByCrypto({
                                unsignedTx: {
                                    tx: unsigned_tx.tx,
                                    rawMsgs: unsigned_tx.rawMsgs
                                },
                                crypto: org_tx.crypto,
                                pwd: org_tx.pwd
                            })];
                    case 2:
                        signed_tx = _a.sent();
                        return [4 /*yield*/, cor.sendTx(signed_tx)];
                    case 3:
                        tx_result = _a.sent();
                        return [2 /*return*/, tx_result];
                }
            });
        });
    };
    return Feature;
}(fetch_1.Fetch));
exports.default = Feature;
