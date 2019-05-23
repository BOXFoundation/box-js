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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
var isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
var api_1 = __importDefault(require("../src/boxd/core/api"));
var feature_1 = __importDefault(require("../src/boxd/core/feature"));
var util_1 = __importDefault(require("../src/boxd/core/token/util"));
var data_json_1 = __importDefault(require("./json/data.json"));
var keystore_json_1 = __importDefault(require("./json/keystore.json"));
var cor = new api_1.default(isomorphic_fetch_1.default, data_json_1.default.endpoint_test, 'http');
var feature = new feature_1.default(isomorphic_fetch_1.default, data_json_1.default.endpoint_test, 'http');
var token_hash;
test('Issue a Token and get the Token Balance', function (done) { return __awaiter(_this, void 0, void 0, function () {
    var issue_result, tx_detail, token_addr, _a, opHash, index, err_1;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, feature.issueTokenByCrypto({
                        tx: {
                            issuer: data_json_1.default.acc_addr_2,
                            owner: data_json_1.default.acc_addr_2,
                            fee: data_json_1.default.fee,
                            tag: {
                                name: data_json_1.default.token_name,
                                symbol: data_json_1.default.token_symbol,
                                supply: data_json_1.default.token_supply,
                                decimal: data_json_1.default.token_decimal
                            }
                        },
                        crypto: keystore_json_1.default.keystore_2,
                        pwd: data_json_1.default.acc_pwd
                    })
                    // console.log('tx_result:', issue_result)
                ];
            case 1:
                issue_result = _b.sent();
                return [4 /*yield*/, cor.viewTxDetail(issue_result.hash)
                    // console.log('tx_detail:', tx_detail)
                ];
            case 2:
                tx_detail = _b.sent();
                // console.log('tx_detail:', tx_detail)
                expect(tx_detail.detail.hash).toEqual(issue_result.hash);
                // console.log('issue_result:', issue_result)
                token_hash = issue_result.hash;
                return [4 /*yield*/, util_1.default.encodeTokenAddr({
                        opHash: token_hash,
                        index: 0
                    })
                    // test func [TokenUtil.decodeTokenAddr]
                ];
            case 3:
                token_addr = _b.sent();
                return [4 /*yield*/, util_1.default.decodeTokenAddr(token_addr)];
            case 4:
                _a = _b.sent(), opHash = _a.opHash, index = _a.index;
                expect(opHash).toEqual(token_hash);
                expect(index).toEqual(0);
                // test func [Core.getTokenbalances]
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var token_balances;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cor.getTokenbalances({
                                    addrs: [data_json_1.default.acc_addr_2, data_json_1.default.acc_addr_2],
                                    tokenHash: token_hash,
                                    tokenIndex: 0
                                })
                                // console.log('token_balances:', token_balances)
                            ];
                            case 1:
                                token_balances = _a.sent();
                                // console.log('token_balances:', token_balances)
                                expect(Number(token_balances.balances[1]) / Math.pow(10, data_json_1.default.token_decimal)).toEqual(data_json_1.default.token_supply);
                                done();
                                return [2 /*return*/];
                        }
                    });
                }); }, 3000);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                console.error('Issue a Token and get the Token Balance Error:', err_1);
                expect(0).toBe(1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
test('Make a Token Transaction', function () { return __awaiter(_this, void 0, void 0, function () {
    var token_result, token_detail, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, feature.makeTokenTxByCrypto({
                        tx: {
                            amounts: data_json_1.default.amounts,
                            fee: data_json_1.default.fee,
                            from: data_json_1.default.acc_addr_2,
                            to: data_json_1.default.to_addrs,
                            token_hash: token_hash,
                            token_index: 0
                        },
                        crypto: keystore_json_1.default.keystore_2,
                        pwd: data_json_1.default.acc_pwd
                    })];
            case 1:
                token_result = _a.sent();
                return [4 /*yield*/, cor.viewTxDetail(token_result.hash)
                    // console.log('token_detail:', token_detail)
                ];
            case 2:
                token_detail = _a.sent();
                // console.log('token_detail:', token_detail)
                expect(token_detail.detail.hash).toEqual(token_result.hash);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error('Make a Token Transaction Error:', err_2);
                expect(0).toBe(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
