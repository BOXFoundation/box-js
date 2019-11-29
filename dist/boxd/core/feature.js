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
var bn_js_1 = __importDefault(require("bn.js"));
var fetch_1 = require("../util/fetch");
var account_1 = __importDefault(require("../account/account"));
var privatekey_1 = __importDefault(require("../util/crypto/privatekey"));
var api_1 = __importDefault(require("../core/api"));
var util_1 = __importDefault(require("../util/util"));
/**
 * @class [Feature]
 * @extends Fetch
 * @constructs _fetch user incoming
 * @constructs endpoint user incoming
 * @constructs fetch_type http / rpc
 */
var Feature = /** @class */ (function (_super) {
    __extends(Feature, _super);
    function Feature(_fetch, endpoint, fetch_type) {
        return _super.call(this, _fetch, endpoint, fetch_type) || this;
    }
    /**
     * @export Sign_transaction_by_priv_key.json
     * @param [*unsigned_tx]
     * @param [*priv_key_hex_str]
     * @returns [signed_tx]
     */
    Feature.prototype.signTxByPrivKey = function (unsigned_tx, priv_key_hex_str) {
        return __awaiter(this, void 0, void 0, function () {
            var privk, unsigned_tx_p;
            return __generator(this, function (_a) {
                privk = new privatekey_1.default(priv_key_hex_str);
                unsigned_tx_p = {
                    privKey: priv_key_hex_str,
                    unsignedTx: unsigned_tx,
                    protocalTx: null
                };
                return [2 /*return*/, privk.signTxByPrivKey(unsigned_tx_p)];
            });
        });
    };
    /**
     * @export Sign_transaction_by_crypto.json
     * @param [*unsigned_tx]
     * @returns [signed_tx]
     */
    Feature.prototype.signTxByCrypto = function (unsigned_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var privKeyHexStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, account_1.default.dumpPrivKeyFromCrypto(unsigned_tx.crypto, unsigned_tx.pwd)];
                    case 1:
                        privKeyHexStr = _a.sent();
                        return [2 /*return*/, this.signTxByPrivKey(unsigned_tx.unsignedTx, privKeyHexStr)];
                }
            });
        });
    };
    /**
     * @export { Make BOX transaction by crypto [Backend Serialization] }
     * @step makeUnsignedBOXTx -> signTxByCrypto -> send_tx
     */
    Feature.prototype.makeBoxTxByCryptoUseBoxd = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, crypto, pwd, api, unsigned_tx, signed_tx_by_crypto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = org_tx.tx, crypto = org_tx.crypto, pwd = org_tx.pwd;
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.makeUnsignedBOXTx(tx)];
                    case 1:
                        unsigned_tx = _a.sent();
                        return [4 /*yield*/, this.signTxByCrypto({
                                unsignedTx: {
                                    tx: unsigned_tx.tx,
                                    rawMsgs: unsigned_tx.rawMsgs
                                },
                                crypto: crypto,
                                pwd: pwd
                            })];
                    case 2:
                        signed_tx_by_crypto = _a.sent();
                        return [4 /*yield*/, api.sendTx(signed_tx_by_crypto)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @export { Make BOX transaction by crypto [Local Serialization] }
     * @step make_privKey -> fetch_utxos -> make_unsigned_tx -> sign_tx->send_tx
     */
    Feature.prototype.makeBoxTxByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, from, to, amounts_1, privKey, total_to_1, to_map_1, api, utxo_res, unsigned_tx, signed_tx, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        _a = org_tx.tx, from = _a.from, to = _a.to, amounts_1 = _a.amounts;
                        return [4 /*yield*/, account_1.default.dumpPrivKeyFromCrypto(org_tx.crypto, org_tx.pwd)
                            /* fetch utxos */
                        ];
                    case 1:
                        privKey = _b.sent();
                        total_to_1 = new bn_js_1.default(0, 10);
                        to_map_1 = {};
                        to.forEach(function (item, index) {
                            to_map_1[item] = amounts_1[index];
                            total_to_1 = total_to_1.add(new bn_js_1.default(amounts_1[index], 10));
                        });
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.fetchUtxos({
                                addr: from,
                                amount: total_to_1.toString()
                            })
                            // console.log('[Make BOX TX by crypto] fetchUtxos res :', JSON.stringify(utxo_res))
                        ];
                    case 2:
                        utxo_res = _b.sent();
                        if (!(utxo_res['code'] === 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, util_1.default.makeUnsignedTxHandle({
                                from: from,
                                to_map: to_map_1,
                                utxo_list: utxo_res.utxos
                            })
                            /* sign tx by privKey */
                        ];
                    case 3:
                        unsigned_tx = _b.sent();
                        return [4 /*yield*/, api.signTxByPrivKey({
                                unsignedTx: unsigned_tx.tx_json,
                                protocalTx: unsigned_tx.protocalTx,
                                privKey: privKey
                            })
                            /* send tx to boxd */
                        ];
                    case 4:
                        signed_tx = _b.sent();
                        return [4 /*yield*/, api.sendTx(signed_tx)];
                    case 5: 
                    /* send tx to boxd */
                    return [2 /*return*/, _b.sent()];
                    case 6: throw new Error('Fetch utxos Error');
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _b.sent();
                        throw new Error(err_1);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @export Make_split_transaction_by_crypto.json
     * @param [*org_tx]
     * @returns [Promise<sent_tx>] { splitAddr: string; hash: string }
     */
    Feature.prototype.makeSplitTxByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var api, unsigned_tx, signed_tx, tx_result, split_addr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.makeUnsignedSplitAddrTx(org_tx.tx)];
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
                        return [4 /*yield*/, api.sendTx(signed_tx)];
                    case 3:
                        tx_result = _a.sent();
                        return [4 /*yield*/, util_1.default.calcSplitAddr({
                                addrs: org_tx.tx.addrs,
                                weights: org_tx.tx.weights,
                                txHash: tx_result.hash,
                                index: tx_result['index']
                            })];
                    case 4:
                        split_addr = _a.sent();
                        return [2 /*return*/, Object.assign(tx_result, {
                                splitAddr: split_addr
                            })];
                }
            });
        });
    };
    /**
     * @export Issue_token_by_crypto.json
     * @param [*org_tx]
     * @returns [Promise<sent_tx>] { hash: string }
     */
    Feature.prototype.issueTokenByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var api, unsigned_tx, signed_tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.makeUnsignedTokenIssueTx(org_tx.tx)];
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
                        return [4 /*yield*/, api.sendTx(signed_tx)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @export Make_token_transaction_by_crypto.json
     * @param [*org_tx]
     * @returns [Promise<sent_tx>] { hash: string }
     */
    Feature.prototype.makeTokenTxByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var api, unsigned_tx, signed_tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.makeUnsignedTokenTx(org_tx.tx)];
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
                        return [4 /*yield*/, api.sendTx(signed_tx)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @export Make_contract_transaction_by_priv_key.json
     * @param [*org_tx]
     * @param [*priv_key_hex_str]
     * @returns [Promise<sent_tx>] { hash: string }
     */
    Feature.prototype.makeContractTxByPrivKey = function (org_tx, priv_key_hex_str) {
        return __awaiter(this, void 0, void 0, function () {
            var api, unsigned_tx, signed_tx, tx_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.makeUnsignedContractTx(org_tx)];
                    case 1:
                        unsigned_tx = _a.sent();
                        return [4 /*yield*/, this.signTxByPrivKey({
                                tx: unsigned_tx.tx,
                                rawMsgs: unsigned_tx.rawMsgs
                            }, priv_key_hex_str)];
                    case 2:
                        signed_tx = _a.sent();
                        return [4 /*yield*/, api.sendTx(signed_tx)];
                    case 3:
                        tx_result = _a.sent();
                        return [2 /*return*/, { hash: tx_result.hash, contractAddr: unsigned_tx.contract_addr }];
                }
            });
        });
    };
    /**
     * @export Make_contract_transaction_by_crypto.json
     * @param [*org_tx]
     * @returns [Promise<sent_tx>] { hash: string }
     */
    Feature.prototype.makeContractTxByCrypto = function (org_tx) {
        return __awaiter(this, void 0, void 0, function () {
            var api, unsigned_tx, signed_tx, tx_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.makeUnsignedContractTx(org_tx.tx)];
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
                        return [4 /*yield*/, api.sendTx(signed_tx)];
                    case 3:
                        tx_result = _a.sent();
                        return [2 /*return*/, { hash: tx_result.hash, contractAddr: unsigned_tx.contract_addr }];
                }
            });
        });
    };
    /**
     * @export Call_contract
     * @param [*org_tx]
     * @returns [Promise<sent_tx>] { result: string }
     */
    Feature.prototype.callContract = function (callParams) {
        return __awaiter(this, void 0, void 0, function () {
            var api, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = new api_1.default(this._fetch, this.endpoint, this.fetch_type);
                        return [4 /*yield*/, api.callContract(callParams)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { result: result.output }];
                }
            });
        });
    };
    return Feature;
}(fetch_1.Fetch));
exports.default = Feature;
