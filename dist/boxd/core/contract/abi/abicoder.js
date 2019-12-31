"use strict";
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
var util_1 = __importDefault(require("../../../util/util"));
var isObject_1 = __importDefault(require("lodash/isObject"));
var isArray_1 = __importDefault(require("lodash/isArray"));
var AbiCoder = /** @class */ (function () {
    function AbiCoder() {
    }
    /**
     * Encodes the function name to its ABI representation, which are the first 4 bytes of the keccak256 of the function name including types.
     *
     * @param [functionName] string|object
     * @returns {encoded function name} string
     */
    AbiCoder.prototype.encodeFunctionSignature = function (functionName) {
        return __awaiter(this, void 0, void 0, function () {
            var keccaked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (isObject_1.default(functionName)) {
                            functionName = util_1.default.jsonInterfaceMethodToString(functionName);
                        }
                        return [4 /*yield*/, util_1.default.keccak256(functionName)];
                    case 1:
                        keccaked = _a.sent();
                        if (keccaked) {
                            return [2 /*return*/, keccaked.slice(2, 10)];
                        }
                        else {
                            throw new Error('keccak return Null !');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Encodes the function name to its ABI representation, which are the first 4 bytes of the keccak256 of the function name including  types.
     *
     * @param [functionName] string|object
     * @returns {encoded function name} string
     */
    AbiCoder.prototype.encodeEventSignature = function (functionName) {
        if (isObject_1.default(functionName)) {
            functionName = util_1.default.jsonInterfaceMethodToString(functionName);
        }
        return util_1.default.keccak256(functionName);
    };
    /**
     * Should be used to encode plain param
     *
     * @param [type] string
     * @param [param] string
     * @returns {encoded plain param} string
     */
    AbiCoder.prototype.encodeParameter = function (type, param) {
        return this.encodeParameters([type], [param]);
    };
    /**
     * Should be used to encode list of params
     *
     * @param [types] array
     * @param [params] array
     * @returns {encoded list of params} string
     */
    AbiCoder.prototype.encodeParameters = function (types, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util_1.default.rawEncode(types, params).toString('hex')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Encodes a function call from its json interface and parameters
     *
     * @param [jsonInterface] object
     * @param [params] array
     * @returns {the encoded ABI for this function call} string
     */
    AbiCoder.prototype.encodeFunctionCall = function (jsonInterface, params) {
        return __awaiter(this, void 0, void 0, function () {
            var signature, type_arr, inputs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.encodeFunctionSignature(jsonInterface)];
                    case 1:
                        signature = _a.sent();
                        type_arr = [];
                        return [4 /*yield*/, jsonInterface['inputs'].forEach(function (item) {
                                type_arr.push(item.type);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.encodeParameters(type_arr, params)];
                    case 3:
                        inputs = _a.sent();
                        return [2 /*return*/, signature + inputs];
                }
            });
        });
    };
    /**
     * Should be used to decode bytes to plain param
     *
     * @param [type] string
     * @param [bytes] string
     * @returns {plain param} object
     */
    AbiCoder.prototype.decodeParameter = function (output, bytes) {
        return this.decodeParameters([output], bytes)[0];
    };
    /**
     * Should be used to decode list of params
     *
     * @param [outputs] {array<string|object>|object}
     * @param [bytes] string
     * @returns {Object with named and indexed properties of the returnValues} object
     */
    AbiCoder.prototype.decodeParameters = function (outputs, bytes) {
        if (isArray_1.default(outputs) && outputs.length === 0) {
            throw new Error('Empty outputs array given!');
        }
        if (!bytes || bytes === '0x' || bytes === '0X') {
            throw new Error("Invalid bytes string given: " + bytes);
        }
        var result = util_1.default.rawDecode(outputs, bytes);
        var returnValues = {};
        var decodedValue;
        if (result) {
            if (outputs.length > 1) {
                outputs.forEach(function (output, i) {
                    decodedValue = result[i];
                    if (decodedValue === '0x') {
                        decodedValue = null;
                    }
                    returnValues[i] = decodedValue;
                    if (isObject_1.default(output) && output['name']) {
                        returnValues[output['name']] = decodedValue;
                    }
                });
                return returnValues;
            }
            return result;
        }
        if (isObject_1.default(outputs[0]) && outputs[0]['name']) {
            returnValues[outputs[0]['name']] = result;
        }
        returnValues[0] = result;
        return returnValues;
    };
    /**
     * @func Decode_events_non_and_indexed_parameters
     * @param [inputs] array
     * @param [data] string
     * @param [topics] array
     * @returns {Object with named and indexed properties of the returnValues} object
     */
    AbiCoder.prototype.decodeLog = function (inputs, data, topics) {
        var _this = this;
        if (data === void 0) { data = ''; }
        var returnValues = {};
        var topicCount = 0;
        var value;
        var nonIndexedInputKeys;
        var nonIndexedInputItems;
        if (!isArray_1.default(topics)) {
            topics = [topics];
        }
        inputs.forEach(function (input, i) {
            if (input.indexed) {
                if (input.type === 'string') {
                    return;
                }
                value = topics[topicCount];
                if (_this.isStaticType(input.type)) {
                    value = _this.decodeParameter(input.type, topics[topicCount]);
                }
                returnValues[i] = value;
                returnValues[input.name] = value;
                topicCount++;
                return;
            }
            nonIndexedInputKeys.push(i);
            nonIndexedInputItems.push(input);
        });
        if (data) {
            var values_1 = this.decodeParameters(nonIndexedInputItems, data);
            var decodedValue_1;
            nonIndexedInputKeys.forEach(function (itemKey, index) {
                decodedValue_1 = values_1[index];
                returnValues[itemKey] = decodedValue_1;
                returnValues[nonIndexedInputItems[index].name] = decodedValue_1;
            });
        }
        return returnValues;
    };
    /**
     * @func Checks_if_a_given_type_string_is_a_static_solidity_type
     * @param [type] string
     * @returns {is static type ?} boolean
     */
    AbiCoder.prototype.isStaticType = function (type) {
        if (type === 'bytes') {
            return false;
        }
        if (type === 'string') {
            return false;
        }
        if (type.indexOf('[') && type.slice(type.indexOf('[')).length === 2) {
            return false;
        }
        return true;
    };
    return AbiCoder;
}());
exports.default = AbiCoder;
