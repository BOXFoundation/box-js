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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var privatekey_1 = __importDefault(require("../util/crypto/privatekey"));
var util_1 = __importDefault(require("../util/util"));
/**
 * @class [Api]
 * @extends Fetch
 * @constructs _fetch user incoming
 * @constructs endpoint user incoming
 * @constructs fetch_type http / rpc
 */
var Api = /** @class */ (function (_super) {
    __extends(Api, _super);
    function Api(_fetch, endpoint, fetch_type) {
        return _super.call(this, _fetch, endpoint, fetch_type) || this;
    }
    /* == Node & Block == */
    /**
     * @func [Get_node_info]
     * @Permission Admin
     */
    Api.prototype.getNodeInfo = function () {
        return _super.prototype.fetch.call(this, "/ctl/getnodeinfo");
    };
    Api.prototype.getBlockHashByHeight = function (height) {
        return _super.prototype.fetch.call(this, "/ctl/getblockhash", { height: height });
    };
    Api.prototype.getCurrentBlockHeight = function () {
        return _super.prototype.fetch.call(this, "/ctl/getcurrentblockheight");
    };
    /**
     * @func [View_block_detail]
     * @by 'block_hash' | 'block_height'
     */
    Api.prototype.viewBlockDetail = function (type, param) {
        if (type === "block_hash") {
            return _super.prototype.fetch.call(this, "/block/detail", { hash: param });
        }
        else {
            return _super.prototype.fetch.call(this, "/block/detail", { height: param });
        }
    };
    /**
     * @func [Get_block_header]
     * @by 'block_hash' | 'block_height'
     */
    Api.prototype.getBlockHeader = function (type, param) {
        return __awaiter(this, void 0, void 0, function () {
            var block_hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(type === "block_hash")) return [3 /*break*/, 1];
                        return [2 /*return*/, _super.prototype.fetch.call(this, "/ctl/getblockheader", { block_hash: param })];
                    case 1: return [4 /*yield*/, this.getBlockHashByHeight(Number(param))];
                    case 2:
                        block_hash = _a.sent();
                        return [2 /*return*/, _super.prototype.fetch.call(this, "/ctl/getblockheader", {
                                block_hash: block_hash.hash
                            })];
                }
            });
        });
    };
    Api.prototype.getNonce = function (addr) {
        return _super.prototype.fetch.call(this, "/account/nonce", { addr: addr });
    };
    /* == For All Transaction == */
    Api.prototype.signTxByPrivKey = function (unsigned_tx) {
        var _privKey = unsigned_tx.privKey;
        var privK = new privatekey_1.default(_privKey);
        return privK.signTxByPrivKey(unsigned_tx);
    };
    Api.prototype.sendTx = function (signed_tx) {
        return _super.prototype.fetch.call(this, "/tx/sendtransaction", { tx: signed_tx });
    };
    Api.prototype.viewTxDetail = function (hash) {
        return _super.prototype.fetch.call(this, "/tx/detail", { hash: hash });
    };
    /* == BOX == */
    Api.prototype.faucet = function (faucet_info) {
        return _super.prototype.fetch.call(this, "/faucet/claim", faucet_info);
    };
    /* make unsigned BOX TX */
    Api.prototype.getBalance = function (addr) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.fetch.call(this, "/tx/getbalance", {
                            addrs: [addr]
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, new bn_js_1.default(res.balances[0], 10).toString()];
                }
            });
        });
    };
    Api.prototype.getBalances = function (addrs) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.fetch.call(this, "/tx/getbalance", { addrs: addrs })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.balances.map(function (balance) {
                                return new bn_js_1.default(balance, 10).toString();
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.prototype.makeUnsignedBOXTx = function (org_tx) {
        return _super.prototype.fetch.call(this, "/tx/makeunsignedtx", org_tx);
    };
    Api.prototype.fetchUtxos = function (utxos_req) {
        return _super.prototype.fetch.call(this, "/tx/fetchutxos", utxos_req);
    };
    /**
     * @func create_raw_tx
     * @branch sendTx || sendRawTx
     * @step fetchUtxos -> makeUnsignTx -> signTxByPrivKey
     *
     * @param *raw
     * @param ?is_raw # is send raw tx ?
     * @returns signed tx
     */
    Api.prototype.createRawTx = function (raw, is_raw) {
        return __awaiter(this, void 0, void 0, function () {
            var addr, to_1, privKey, total_to_1, utxo_res, utxo_list, unsigned_tx, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        addr = raw.addr, to_1 = raw.to, privKey = raw.privKey;
                        total_to_1 = new bn_js_1.default(0, 10);
                        /* make total_to */
                        Object.keys(to_1).forEach(function (addr) {
                            total_to_1 = total_to_1.add(new bn_js_1.default(to_1[addr], 10));
                        });
                        return [4 /*yield*/, this.fetchUtxos({
                                addr: addr,
                                amount: total_to_1.toString()
                            })
                            // console.log('[Create raw TX] fetchUtxos res :', JSON.stringify(utxo_res))
                        ];
                    case 1:
                        utxo_res = _a.sent();
                        if (!(utxo_res["code"] === 0)) return [3 /*break*/, 4];
                        utxo_list = utxo_res.utxos;
                        return [4 /*yield*/, util_1.default.makeUnsignedTxHandle({
                                from: addr,
                                to_map: to_1,
                                utxo_list: utxo_list,
                                is_raw: is_raw
                            })
                            // console.log('[Create raw TX] unsigned tx :', JSON.stringify(unsigned_tx))
                            /* sign tx by privKey */
                        ];
                    case 2:
                        unsigned_tx = _a.sent();
                        return [4 /*yield*/, this.signTxByPrivKey({
                                unsignedTx: unsigned_tx.tx_json,
                                privKey: privKey,
                                protocalTx: unsigned_tx.protocalTx
                            })];
                    case 3: 
                    // console.log('[Create raw TX] unsigned tx :', JSON.stringify(unsigned_tx))
                    /* sign tx by privKey */
                    return [2 /*return*/, _a.sent()];
                    case 4: throw new Error("Fetch utxos Error !");
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        throw new Error(err_1);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /*TODO public sendRawTx(raw_tx) {
      return super.fetch("/tx/sendrawtransaction", { tx: raw_tx })
    } */
    /* Contract */
    Api.prototype.makeUnsignedContractTx = function (org_tx) {
        return _super.prototype.fetch.call(this, "/tx/makeunsignedtx/contract", org_tx);
    };
    Api.prototype.callContract = function (org_tx) {
        return _super.prototype.fetch.call(this, "/contract/call", org_tx);
    };
    Api.prototype.getLogs = function (logs_req) {
        return _super.prototype.fetch.call(this, "/contract/getLogs", logs_req);
    };
    /* == Split Contract == */
    Api.prototype.makeUnsignedSplitAddrTx = function (split_addr_tx) {
        return _super.prototype.fetch.call(this, "/tx/makeunsignedtx/splitaddr", split_addr_tx);
    };
    /* == Token == */
    Api.prototype.getTokenbalance = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var balances, arr_balances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token["addrs"] = [token.addr];
                        return [4 /*yield*/, _super.prototype.fetch.call(this, "/tx/gettokenbalance", token)];
                    case 1:
                        balances = _a.sent();
                        return [4 /*yield*/, balances.balances.map(function (balance) {
                                return new bn_js_1.default(balance, 10).toString();
                            })];
                    case 2:
                        arr_balances = _a.sent();
                        return [2 /*return*/, { balance: arr_balances[0] }];
                }
            });
        });
    };
    Api.prototype.getTokenbalances = function (tokens) {
        return __awaiter(this, void 0, void 0, function () {
            var balances, arr_balances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.fetch.call(this, "/tx/gettokenbalance", tokens)];
                    case 1:
                        balances = _a.sent();
                        return [4 /*yield*/, balances.balances.map(function (balance) {
                                return new bn_js_1.default(balance, 10).toString();
                            })];
                    case 2:
                        arr_balances = _a.sent();
                        return [2 /*return*/, { balances: arr_balances }];
                }
            });
        });
    };
    Api.prototype.makeUnsignedTokenIssueTx = function (token_issue_tx) {
        return _super.prototype.fetch.call(this, "/tx/makeunsignedtx/token/issue", token_issue_tx);
    };
    Api.prototype.makeUnsignedTokenTx = function (token_transfer_tx) {
        return _super.prototype.fetch.call(this, "/tx/makeunsignedtx/token/transfer", token_transfer_tx);
    };
    return Api;
}(fetch_1.Fetch));
exports.default = Api;
