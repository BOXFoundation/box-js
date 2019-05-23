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
var account_1 = __importDefault(require("../src/boxd/account/account"));
var account_manager_1 = __importDefault(require("../src/boxd/account/account-manager"));
var data_json_1 = __importDefault(require("./json/data.json"));
var keystore_json_1 = __importDefault(require("./json/keystore.json"));
var OP_CODE_TYPE = 'hex';
var acc_buf = Buffer.from(data_json_1.default.acc_privateKey, OP_CODE_TYPE);
var updateAccount = function (new_acc_list) {
    if (new_acc_list === void 0) { new_acc_list = {}; }
    // console.log('new_acc_list', new_acc_list)
    acc_list_result = new_acc_list;
};
var acc = new account_1.default();
var accManager = new account_manager_1.default(data_json_1.default.acc_list, updateAccount);
var acc_list_result;
test('Dump PublicKey from PrivateKey(string | Buffer)', function () { return __awaiter(_this, void 0, void 0, function () {
    var addr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, acc.dumpAddrFromPrivKey(data_json_1.default.acc_privateKey)];
            case 1:
                addr = _a.sent();
                expect(addr).toEqual(data_json_1.default.acc_addr);
                return [4 /*yield*/, acc.dumpAddrFromPrivKey(acc_buf)];
            case 2:
                addr = _a.sent();
                expect(addr).toEqual(data_json_1.default.acc_addr);
                return [2 /*return*/];
        }
    });
}); });
test('Dump Crypto Json from PrivateKey(string | Buffer)', function () { return __awaiter(_this, void 0, void 0, function () {
    var crypto_res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, acc.dumpCryptoFromPrivKey(data_json_1.default.acc_privateKey, data_json_1.default.acc_pwd)];
            case 1:
                crypto_res = _a.sent();
                expect(typeof crypto_res).toEqual('object');
                return [4 /*yield*/, acc.dumpCryptoFromPrivKey(acc_buf, data_json_1.default.acc_pwd)];
            case 2:
                crypto_res = _a.sent();
                expect(typeof crypto_res).toEqual('object');
                return [2 /*return*/];
        }
    });
}); });
test('Dump PublicKey from PrivateKey(string | Buffer)', function () { return __awaiter(_this, void 0, void 0, function () {
    var pubKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, acc.dumpPubKeyFromPrivKey(data_json_1.default.acc_privateKey)];
            case 1:
                pubKey = _a.sent();
                expect(pubKey).toEqual(data_json_1.default.acc_publicKey);
                return [4 /*yield*/, acc.dumpPubKeyFromPrivKey(acc_buf)];
            case 2:
                pubKey = _a.sent();
                expect(pubKey).toEqual(data_json_1.default.acc_publicKey);
                return [2 /*return*/];
        }
    });
}); });
test('Dump PublicKey Hash from PrivateKey(string | Buffer)', function () { return __awaiter(_this, void 0, void 0, function () {
    var pubKey_hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, acc.dumpPubKeyHashFromPrivKey(data_json_1.default.acc_privateKey)];
            case 1:
                pubKey_hash = _a.sent();
                expect(pubKey_hash).toEqual(data_json_1.default.acc_publickey_hash);
                return [4 /*yield*/, acc.dumpPubKeyHashFromPrivKey(acc_buf)];
            case 2:
                pubKey_hash = _a.sent();
                expect(pubKey_hash).toEqual(data_json_1.default.acc_publickey_hash);
                return [2 /*return*/];
        }
    });
}); });
test('Dump PublicKey Hash from Address', function () { return __awaiter(_this, void 0, void 0, function () {
    var pubKey_hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, acc.dumpPubKeyHashFromAddr(data_json_1.default.acc_addr)];
            case 1:
                pubKey_hash = _a.sent();
                expect(pubKey_hash).toEqual(data_json_1.default.acc_publickey_hash);
                return [2 /*return*/];
        }
    });
}); });
test('Dump PrivateKey from Crypto Json', function () { return __awaiter(_this, void 0, void 0, function () {
    var privateKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, acc.dumpPrivKeyFromCrypto(keystore_json_1.default.keystore, data_json_1.default.acc_pwd)];
            case 1:
                privateKey = _a.sent();
                expect(privateKey).toEqual(data_json_1.default.acc_privateKey);
                return [2 /*return*/];
        }
    });
}); });
test('Dump PublicKey Hash from Address', function () { return __awaiter(_this, void 0, void 0, function () {
    var pubKey_hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, acc.dumpPubKeyHashFromAddr(data_json_1.default.acc_addr)];
            case 1:
                pubKey_hash = _a.sent();
                expect(pubKey_hash).toEqual(data_json_1.default.acc_publickey_hash);
                return [2 /*return*/];
        }
    });
}); });
test('Create an Account', function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, cryptoJson, P2PKH;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, acc.getCryptoByPwd(data_json_1.default.acc_pwd)];
            case 1:
                _a = _b.sent(), cryptoJson = _a.cryptoJson, P2PKH = _a.P2PKH;
                expect(cryptoJson.address).toEqual(P2PKH);
                return [4 /*yield*/, accManager.addToAccList(cryptoJson, {
                        name: data_json_1.default.acc_name,
                        P2PKH: P2PKH
                    })
                    /*   console.log('Acc addr:', JSON.stringify(P2PKH))
                    console.log('Acc cryptoJson:', JSON.stringify(cryptoJson))
                    const privkey = await acc.dumpPrivKeyFromCrypto(cryptoJson, Data.acc_pwd)
                    console.log('Acc privkey:', JSON.stringify(privkey)) */
                ];
            case 2:
                _b.sent();
                /*   console.log('Acc addr:', JSON.stringify(P2PKH))
                console.log('Acc cryptoJson:', JSON.stringify(cryptoJson))
                const privkey = await acc.dumpPrivKeyFromCrypto(cryptoJson, Data.acc_pwd)
                console.log('Acc privkey:', JSON.stringify(privkey)) */
                expect(acc_list_result[P2PKH].name).toEqual(data_json_1.default.acc_name);
                expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH);
                return [2 /*return*/];
        }
    });
}); });
test('Import an Account by PrivateKey', function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, cryptoJson, P2PKH;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, acc.getCryptoByPwd(data_json_1.default.acc_pwd, data_json_1.default.acc_privateKey)];
            case 1:
                _a = _b.sent(), cryptoJson = _a.cryptoJson, P2PKH = _a.P2PKH;
                expect(cryptoJson.address).toEqual(P2PKH);
                return [4 /*yield*/, accManager.addToAccList(cryptoJson, {
                        name: data_json_1.default.acc_name,
                        P2PKH: P2PKH
                    })];
            case 2:
                _b.sent();
                expect(acc_list_result[P2PKH].name).toEqual(data_json_1.default.acc_name);
                expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH);
                return [2 /*return*/];
        }
    });
}); });
test('Import an Account by Crypto Json', function () { return __awaiter(_this, void 0, void 0, function () {
    var privkey, _a, cryptoJson, P2PKH;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, acc.dumpPrivKeyFromCrypto(keystore_json_1.default.keystore, data_json_1.default.acc_pwd)];
            case 1:
                privkey = _b.sent();
                return [4 /*yield*/, acc.getCryptoByPwd(data_json_1.default.acc_pwd, privkey)];
            case 2:
                _a = _b.sent(), cryptoJson = _a.cryptoJson, P2PKH = _a.P2PKH;
                expect(cryptoJson.address).toEqual(P2PKH);
                return [4 /*yield*/, accManager.addToAccList(cryptoJson, {
                        name: data_json_1.default.acc_name,
                        P2PKH: P2PKH
                    })];
            case 3:
                _b.sent();
                expect(acc_list_result[P2PKH].name).toEqual(data_json_1.default.acc_name);
                expect(acc_list_result[P2PKH].P2PKH).toEqual(P2PKH);
                return [2 /*return*/];
        }
    });
}); });
