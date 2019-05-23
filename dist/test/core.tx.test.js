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
var api_1 = __importDefault(require("../src/boxd/core/api"));
var feature_1 = __importDefault(require("../src/boxd/core/feature"));
var isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
var data_json_1 = __importDefault(require("./json/data.json"));
var keystore_json_1 = __importDefault(require("./json/keystore.json"));
var cor = new api_1.default(isomorphic_fetch_1.default, data_json_1.default.endpoint_test, 'http');
var feature = new feature_1.default(isomorphic_fetch_1.default, data_json_1.default.endpoint_test, 'http');
test('Make a BOX Transaction', function () { return __awaiter(_this, void 0, void 0, function () {
    var tx_result, tx_detail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, feature.makeBoxTxByCrypto({
                    tx: {
                        from: data_json_1.default.acc_addr_3,
                        to: data_json_1.default.to_addrs,
                        amounts: data_json_1.default.amounts,
                        fee: data_json_1.default.fee
                    },
                    crypto: keystore_json_1.default.keystore_3,
                    pwd: data_json_1.default.acc_pwd
                })];
            case 1:
                tx_result = _a.sent();
                return [4 /*yield*/, cor.viewTxDetail(tx_result.hash)];
            case 2:
                tx_detail = _a.sent();
                expect(tx_detail.detail.hash).toEqual(tx_result.hash);
                return [2 /*return*/];
        }
    });
}); });
/* test('Sign Transaction by PrivKey or Crypto', async () => {
  await cor
    .makeUnsignedTx({
      from: Data.acc_addr_3,
      to: Data.to_addrs,
      amounts: Data.amounts,
      fee: Data.fee
    })
    .then(async res => {
      // console.log('unsigned_tx:', JSON.stringify(res))
      const signed_tx = await cor.signTxByPrivKey({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        privKey: Data.acc_privateKey_3
      })
      const signed_tx_acc = await feature.signTxByCrypto({
        unsignedTx: {
          tx: res.tx,
          rawMsgs: res.rawMsgs
        },
        crypto: Keystore.keystore_3,
        pwd: Data.acc_pwd
      })
      expect(signed_tx).toEqual(signed_tx_acc)
    })
    .catch(err => {
      console.error('Sign Transaction by PrivKey or Crypto Error:', err)
      expect(0).toBe(1)
    })
}) */
test('Get the BOX Balance of the given Address', function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cor
                    .getBalance(data_json_1.default.acc_addr_3)
                    .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        // console.log('getBalance res:', JSON.stringify(res))
                        expect(res);
                        return [2 /*return*/];
                    });
                }); })
                    .catch(function (err) {
                    console.log('getBalance Error:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Get the BOX Balances of the given Addresses', function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cor
                    .getBalances([data_json_1.default.acc_addr_3, data_json_1.default.acc_addr_3])
                    .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        expect(res);
                        return [2 /*return*/];
                    });
                }); })
                    .catch(function (err) {
                    console.log('getBalances Error:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/* test('faucet', async () => {
  const faucet_res = await cor.faucet({
    addr: Data.acc_addr_3,
    amount: 30000000000
  })
  console.log('faucet res:', faucet_res)
}) */
// todo
/* test('Make a Raw Transaction', async () => {
  await cor
    .createRawTx({
      addr: Data.acc_addr_3,
      to: Data.to_map,
      fee: Data.fee,
      privKey: Data.acc_privateKey_3
    })
    .then(async res => {
      console.log('createRawTx res:', JSON.stringify(res))
      // expect(res.code).toEqual(0)
    })
    .catch(err => {
      console.error('Make a Raw Transaction Error:', err)
      // expect(0).toBe(1)
    })
}) */
