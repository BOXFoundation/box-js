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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @func http-Fetch-function
 * @param [*body] object  // request body
 * @returns [result]  // response => result
 */
var httpFetch = function (path, body, _fetch, endpoint) { return __awaiter(_this, void 0, void 0, function () {
    var response, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, _fetch(endpoint + '/v1' + path, {
                        body: JSON.stringify(body),
                        method: 'POST'
                    })
                    // console.log('[fetch] response:', response)
                    // handle
                ];
            case 1:
                // console.log(`[fetch] ${path}:\n`, JSON.stringify(body))
                // request
                response = _a.sent();
                // console.log('[fetch] response:', response)
                // handle
                if (response.status >= 400) {
                    // console.log('[fetch] Error: status >= 400')
                    result.code = response.status;
                    result.statusText = response.statusText;
                    throw new HttpError(result);
                }
                return [4 /*yield*/, response.json()
                    // console.log('[fetch] Result:', result)
                ];
            case 2:
                result = _a.sent();
                // console.log('[fetch] Result:', result)
                if (result.code) {
                    if (result.code === 0) {
                        delete result.code;
                        delete result.message;
                    }
                    else {
                        // console.log('[fetch] Error: code !== 0')
                        throw new HttpError(result);
                    }
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                err_1.isFetchError = true;
                throw new Error(err_1);
            case 4:
                if (!response.ok) {
                    throw new HttpError(result);
                }
                return [2 /*return*/, result];
        }
    });
}); };
var rpcFetch = function (path, body, _fetch, endpoint) {
    console.log('rpcFetch:', path, body, _fetch, endpoint);
};
/**
 * @class [Http-Error]
 * @extends Error
 */
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    // Detailed error information
    function HttpError(json) {
        var _this = this;
        if (json.error &&
            json.error.details &&
            json.error.details.length &&
            json.error.details[0].message) {
            _this = _super.call(this, json.error.details[0].message) || this;
        }
        else if (json.processed &&
            json.processed.except &&
            json.processed.except.message) {
            _this = _super.call(this, json.processed.except.message) || this;
        }
        else if (json.message) {
            _this = _super.call(this, json.message) || this;
        }
        else if (json.statusText) {
            _this = _super.call(this, json.statusText) || this;
        }
        else {
            _this = _super.call(this, 'Unknow Error!') || this;
        }
        Object.setPrototypeOf(_this, HttpError.prototype);
        _this.json = json;
        return _this;
    }
    return HttpError;
}(Error));
/**
 * @class [Http]
 * @constructs _fetch  // user incoming
 * @constructs endpoint string // user incoming
 * @constructs path string  // URL path
 */
var Fetch = /** @class */ (function () {
    function Fetch(_fetch, endpoint, fetch_type) {
        if (!_fetch) {
            throw new Error('RPC.fetch is required!');
        }
        if (!endpoint) {
            throw new Error('RPC.endpoint is required!');
        }
        this._fetch = _fetch;
        this.endpoint = endpoint;
        this.fetch_type = fetch_type;
    }
    Fetch.prototype.fetch = function (path, body) {
        if (body === void 0) { body = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.fetch_type === 'rpc') {
                    return [2 /*return*/, rpcFetch(path, body, this._fetch, this.endpoint)];
                }
                else {
                    return [2 /*return*/, httpFetch(path, body, this._fetch, this.endpoint)];
                }
                return [2 /*return*/];
            });
        });
    };
    return Fetch;
}());
exports.Fetch = Fetch;
