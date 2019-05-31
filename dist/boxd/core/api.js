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
var privatekey_1 = __importDefault(require("../util/crypto/privatekey"));
/**
 * @class [Api]
 * @extends Fetch
 * @constructs _fetch // user incoming
 * @constructs endpoint string // user incoming
 */
var Api = /** @class */ (function (_super) {
    __extends(Api, _super);
    function Api(_fetch, endpoint, fetch_type) {
        return _super.call(this, _fetch, endpoint, fetch_type) || this;
    }
    // Block
    Api.prototype.getNodeInfo = function () {
        return _super.prototype.fetch.call(this, '/ctl/getnodeinfo');
    };
    /* UNDO
      addNode(nodeId: string) {
      return super.fetch('/ctl/addnode', { nodeId })
    } */
    Api.prototype.getBlockHashByHeight = function (blockHeight) {
        return _super.prototype.fetch.call(this, '/ctl/getblockhash', { blockHeight: blockHeight });
    };
    Api.prototype.getBlockByHash = function (blockHash) {
        return _super.prototype.fetch.call(this, '/ctl/getblock', { blockHash: blockHash });
    };
    Api.prototype.getBlockByHeight = function (block_height) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockHashByHeight(block_height)
                            .then(function (block_hash) {
                            // console.log('getBlockHashByHeight res:', block_hash)
                            return _super.prototype.fetch.call(_this, '/ctl/getblock', {
                                blockHash: block_hash.hash
                            });
                        })
                            .catch(function (err) {
                            console.log('getBlockHashByHeight Error:', err);
                            throw new Error('getBlockHashByHeight Error');
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.prototype.getBlockHeaderByHash = function (blockHash) {
        return _super.prototype.fetch.call(this, '/ctl/getblockheader', { blockHash: blockHash });
    };
    Api.prototype.getBlockHeaderByHeight = function (block_height) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockHashByHeight(block_height)
                            .then(function (block_hash) {
                            // console.log('getBlockHashByHeight res:', block_hash)
                            return _super.prototype.fetch.call(_this, '/ctl/getblockheader', {
                                blockHash: block_hash.hash
                            });
                        })
                            .catch(function (err) {
                            console.log('getBlockHashByHeight Error:', err);
                            throw new Error('getBlockHashByHeight Error');
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.prototype.getBlockHeight = function () {
        return _super.prototype.fetch.call(this, '/ctl/getblockheight');
    };
    Api.prototype.viewBlockDetail = function (hash) {
        return _super.prototype.fetch.call(this, '/block/detail', { hash: hash });
    };
    // Split
    Api.prototype.makeUnsignedSplitAddrTx = function (split_addr_tx) {
        return _super.prototype.fetch.call(this, '/tx/makeunsignedtx/splitaddr', split_addr_tx);
    };
    // Token
    Api.prototype.makeUnsignedTokenIssueTx = function (token_issue_tx) {
        return _super.prototype.fetch.call(this, '/tx/makeunsignedtx/token/issue', token_issue_tx);
    };
    Api.prototype.getTokenbalance = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var balances, arr_balances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token['addrs'] = [token.addr];
                        return [4 /*yield*/, _super.prototype.fetch.call(this, '/tx/gettokenbalance', token)];
                    case 1:
                        balances = _a.sent();
                        return [4 /*yield*/, balances.balances.map(function (item) {
                                return Number(item);
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
                    case 0: return [4 /*yield*/, _super.prototype.fetch.call(this, '/tx/gettokenbalance', tokens)];
                    case 1:
                        balances = _a.sent();
                        return [4 /*yield*/, balances.balances.map(function (item) {
                                return Number(item);
                            })];
                    case 2:
                        arr_balances = _a.sent();
                        return [2 /*return*/, { balances: arr_balances }];
                }
            });
        });
    };
    Api.prototype.makeUnsignedTokenTx = function (token_transfer_tx) {
        return _super.prototype.fetch.call(this, '/tx/makeunsignedtx/token/transfer', token_transfer_tx);
    };
    Api.prototype.fetchTokenUtxos = function (fetch_utxos_req) {
        return _super.prototype.fetch.call(this, 'todo', fetch_utxos_req);
    };
    // TX
    Api.prototype.faucet = function (req) {
        return _super.prototype.fetch.call(this, '/faucet/claim', req);
    };
    Api.prototype.makeUnsignedTx = function (tx) {
        return _super.prototype.fetch.call(this, '/tx/makeunsignedtx', tx);
    };
    Api.prototype.signTxByPrivKey = function (unsigned_tx) {
        var _privKey = unsigned_tx.privKey;
        var privK = new privatekey_1.default(_privKey);
        return privK.signTxByPrivKey(unsigned_tx);
    };
    Api.prototype.sendTx = function (signed_tx) {
        return _super.prototype.fetch.call(this, '/tx/sendtransaction', { tx: signed_tx });
    };
    Api.prototype.viewTxDetail = function (hash) {
        return _super.prototype.fetch.call(this, '/tx/detail', { hash: hash });
    };
    Api.prototype.getBalance = function (addr) {
        return __awaiter(this, void 0, void 0, function () {
            var balances, arr_balances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.fetch.call(this, '/tx/getbalance', { addrs: [addr] })];
                    case 1:
                        balances = _a.sent();
                        return [4 /*yield*/, balances.balances.map(function (item) {
                                return Number(item);
                            })];
                    case 2:
                        arr_balances = _a.sent();
                        return [2 /*return*/, { balance: arr_balances[0] }];
                }
            });
        });
    };
    Api.prototype.getBalances = function (addrs) {
        return __awaiter(this, void 0, void 0, function () {
            var balances, arr_balances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.fetch.call(this, '/tx/getbalance', { addrs: addrs })];
                    case 1:
                        balances = _a.sent();
                        return [4 /*yield*/, balances.balances.map(function (item) {
                                return Number(item);
                            })];
                    case 2:
                        arr_balances = _a.sent();
                        return [2 /*return*/, { balances: arr_balances }];
                }
            });
        });
    };
    Api.prototype.fetchUtxos = function (fetch_utxos_req) {
        return _super.prototype.fetch.call(this, '/tx/fetchutxos', fetch_utxos_req);
    };
    // TODO Raw
    Api.prototype.makeUnsignedContractTx = function (tx) {
        return _super.prototype.fetch.call(this, '/todo', tx);
    };
    Api.prototype.createRawTx = function (raw) {
        return __awaiter(this, void 0, void 0, function () {
            var addr, to, fee, privKey, sum;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addr = raw.addr, to = raw.to, fee = raw.fee, privKey = raw.privKey;
                        sum = 0;
                        return [4 /*yield*/, Object.keys(to).forEach(function (item) {
                                sum += Number(to[item]);
                            })];
                    case 1:
                        _a.sent();
                        sum += Number(fee);
                        console.log('fetchUtxos:', addr, sum);
                        return [4 /*yield*/, this.fetchUtxos({ addr: addr, amount: sum })
                                .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                var utxos;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log('fetchUtxos res:', res);
                                            if (!(res.code === 0)) return [3 /*break*/, 2];
                                            utxos = res.utxos;
                                            return [4 /*yield*/, _super.prototype.fetch.call(this, '/tx/getrawtransaction', {
                                                    from: addr,
                                                    to: to,
                                                    fee: fee,
                                                    utxos: utxos
                                                })
                                                    .then(function (res) {
                                                    console.log('unsigned_tx:', res);
                                                    console.log('privKey:', privKey);
                                                    // todo verify
                                                    return _this.signTxByPrivKey({
                                                        unsignedTx: {
                                                            tx: res.tx,
                                                            rawMsgs: res.rawMsgs
                                                        },
                                                        privKey: privKey
                                                    });
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2: throw new Error('createRawTx Error');
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (err) {
                                console.log('createRawTx Error:', err);
                                throw new Error('createRawTx Error');
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Api.prototype.sendRawTx = function (raw_tx) {
        return _super.prototype.fetch.call(this, '/tx/sendrawtransaction', { raw_tx: raw_tx });
    };
    return Api;
}(fetch_1.Fetch));
exports.default = Api;