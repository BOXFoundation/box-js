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
var isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
var data_json_1 = __importDefault(require("./json/data.json"));
var cor = new api_1.default(isomorphic_fetch_1.default, data_json_1.default.endpoint_test, 'http');
var node_id;
test('Get Node Info', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.getNodeInfo]
            return [4 /*yield*/, cor
                    .getNodeInfo()
                    .then(function (node_info) {
                    // console.log('node_info:', node_info)
                    node_id = node_info.nodes[0].id;
                    console.log('node_id:', node_id);
                })
                    .catch(function (err) {
                    console.error('getNodeInfo err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.getNodeInfo]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/*
// undo
 test('Add Node', async () => {
  // test func [Api.addNode]
  await cor
    .addNode(node_id)
    .then(res => {
      console.log('addNode res:', res)
    })
    .catch(err => {
      console.error('addNode err:', err)
      expect(0).toBe(1)
    })
}) */
test('Get Block Hash by Height', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.getBlockHashByHeight]
            return [4 /*yield*/, cor
                    .getBlockHashByHeight(data_json_1.default.blockHeight)
                    .then(function (res) {
                    // console.log('getBlockHashByHeight res:', res)
                    expect(res);
                })
                    .catch(function (err) {
                    console.error('getBlockHashByHeight err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.getBlockHashByHeight]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Get Block by Height', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.getBlockByHeight]
            return [4 /*yield*/, cor
                    .getBlockByHeight(data_json_1.default.blockHeight)
                    .then(function (res) {
                    // console.log('getBlockByHeight res:', res)
                    expect(res);
                })
                    .catch(function (err) {
                    console.error('getBlockByHeight err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.getBlockByHeight]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Get Block by Hash', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.getBlockByHash]
            return [4 /*yield*/, cor
                    .getBlockByHash(data_json_1.default.blockHash)
                    .then(function (res) {
                    // console.log('getBlockByHash res:', res)
                    expect(res);
                })
                    .catch(function (err) {
                    console.error('getBlockByHash err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.getBlockByHash]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Get Block Header by Hash', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.getBlockHeaderByHash]
            return [4 /*yield*/, cor
                    .getBlockHeaderByHash(data_json_1.default.blockHash)
                    .then(function (res) {
                    // console.log('getBlockHeaderByHash res:', res)
                    expect(res);
                })
                    .catch(function (err) {
                    console.error('getBlockHeaderByHash err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.getBlockHeaderByHash]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Get Block Header by Height', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.getBlockHeaderByHeight]
            return [4 /*yield*/, cor
                    .getBlockHeaderByHeight(data_json_1.default.blockHeight)
                    .then(function (res) {
                    // console.log('getBlockHeaderByHeight res:', res)
                    expect(res);
                })
                    .catch(function (err) {
                    console.error('getBlockHeaderByHeight err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.getBlockHeaderByHeight]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Get Block Height', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.getBlockHeight]
            return [4 /*yield*/, cor
                    .getBlockHeight()
                    .then(function (res) {
                    // console.log('getBlockHeight res:', res)
                    expect(res);
                })
                    .catch(function (err) {
                    console.error('getBlockHeight err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.getBlockHeight]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('View Block Detail', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // test func [Api.viewBlockDetail]
            return [4 /*yield*/, cor
                    .viewBlockDetail(data_json_1.default.blockHash)
                    .then(function (res) {
                    // console.log('viewBlockDetail res:', JSON.stringify(res))
                    expect(res);
                })
                    .catch(function (err) {
                    console.error('viewBlockDetail err:', err);
                    expect(0).toBe(1);
                })];
            case 1:
                // test func [Api.viewBlockDetail]
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
