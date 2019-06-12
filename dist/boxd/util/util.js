"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var var_1 = __importDefault(require("./var"));
var verify_1 = __importDefault(require("./verify"));
var hash_1 = __importDefault(require("./crypto/hash"));
var isObject_1 = __importDefault(require("lodash/isObject"));
var isArray_1 = __importDefault(require("lodash/isArray"));
var isString_1 = __importDefault(require("lodash/isString"));
var isNumber_1 = __importDefault(require("lodash/isNumber"));
var OP_PUSH_DATA1 = var_1.default.OP_PUSH_DATA1, OP_PUSH_DATA2 = var_1.default.OP_PUSH_DATA2, OP_PUSH_DATA4 = var_1.default.OP_PUSH_DATA4;
var OP_CODE_TYPE = 'hex';
var gethexByteWithNumber = function (num) { return (num & 255).toString(16); };
/* keccak = BEGIN = */
var KECCAK256_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
var isHexStrict = function (hex) {
    return (isString_1.default(hex) || isNumber_1.default(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex);
};
var hexToBytes = function (hex) {
    hex = hex.toString(16);
    if (!isHexStrict(hex)) {
        throw new Error('Given value "'.concat(hex, '" is not a valid hex string.'));
    }
    hex = hex.replace(/^0x/i, '');
    hex = hex.length % 2 ? '0' + hex : hex;
    var bytes = [];
    for (var c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
};
/* keccak = END = */
var _flattenTypes = function _flattenTypes(includeTuple, puts) {
    var types = [];
    puts.forEach(function (param) {
        if (verify_1.default._typeof(param.components) === 'object') {
            if (param.type.substring(0, 5) !== 'tuple') {
                throw new Error('components found but type is not tuple; report on GitHub');
            }
            var suffix = '';
            var arrayBracket = param.type.indexOf('[');
            if (arrayBracket >= 0) {
                suffix = param.type.substring(arrayBracket);
            }
            var result = _flattenTypes(includeTuple, param.components);
            if (isArray_1.default(result) && includeTuple) {
                types.push('tuple('.concat(result.join(','), ')').concat(suffix));
            }
            else if (!includeTuple) {
                types.push('('.concat(result.join(','), ')').concat(suffix));
            }
            else {
                types.push('('.concat(result, ')'));
            }
        }
        else {
            types.push(param.type);
        }
    });
    return types;
};
var Util;
(function (Util) {
    Util.getNumberByte = function (num) { return num & 255; };
    /**
     * @export put-Uint16
     * @param [*bytes]
     * @param [*uint16]
     * @returns [bytes]
     */
    Util.putUint16 = function (bytes, uint16) {
        if (bytes.length < 2) {
            return new Error('The length of the bytes should more than 2 !');
        }
        bytes[0] = Util.getNumberByte(uint16);
        bytes[1] = uint16 >> 8;
        return bytes;
    };
    /**
     * @export add-Operand
     * @param [*strBuf] Buffer | Uint8Array
     * @param [*operand] Buffer
     * @returns Buffer
     */
    var addOperand = function (strBuf, operand) {
        var dataLen = operand.length;
        var dataLen_str = gethexByteWithNumber(dataLen);
        if (dataLen < OP_PUSH_DATA1) {
            strBuf = Buffer.from(strBuf.toString(OP_CODE_TYPE) + dataLen_str, OP_CODE_TYPE);
        }
        else if (dataLen <= 0xff) {
            strBuf = Buffer.concat([
                strBuf,
                Buffer.from(gethexByteWithNumber(OP_PUSH_DATA1), OP_CODE_TYPE),
                Buffer.from(dataLen_str, OP_CODE_TYPE)
            ]);
        }
        else if (dataLen <= 0xffff) {
            var buf = Buffer.alloc(2);
            buf = Util.putUint16(buf, dataLen);
            strBuf = Buffer.concat([
                strBuf,
                Buffer.from(gethexByteWithNumber(OP_PUSH_DATA2), OP_CODE_TYPE),
                buf
            ]);
        }
        else {
            var buf = Buffer.alloc(4);
            buf = Util.putUint16(buf, dataLen);
            strBuf = Buffer.concat([
                strBuf,
                Buffer.from(gethexByteWithNumber(OP_PUSH_DATA4), OP_CODE_TYPE),
                buf
            ]);
        }
        // Append the actual operand
        return Buffer.concat([strBuf, operand]);
    };
    /**
     * @export put-Uint32
     * TODO: it not support int32 now
     * @param [*bytes]
     * @param [*uint32]
     * @returns [bytes]
     */
    Util.putUint32 = function (bytes, uint32) {
        if (bytes.length < 4) {
            return new Error('The length of the bytes should more than 4 !');
        }
        bytes[0] = Util.getNumberByte(uint32);
        bytes[1] = uint32 >> 8;
        bytes[2] = uint32 >> 16;
        bytes[3] = uint32 >> 24;
        return bytes;
    };
    /**
     * @export signature-Script
     * @param [*sigBuf] Buffer
     * @param [*Buffer] Buffer
     * @returns [end] Buffer
     */
    Util.signatureScript = function (sigBuf, pubKeyBuf) {
        var before = addOperand(Buffer.from([]), sigBuf);
        var end = addOperand(before, pubKeyBuf);
        return end;
    };
    /**
     * @export get-SignHash
     * @param [*protobuf] string
     * @returns
     */
    Util.getSignHash = function (protobuf) {
        return hash_1.default.hash256(Buffer.from(protobuf, 'base64'));
    };
    Util.jsonInterfaceMethodToString = function (json) {
        if (isObject_1.default(json) && json.name && json.name.includes('(')) {
            return json.name;
        }
        return ''
            .concat(json.name, '(')
            .concat(_flattenTypes(false, json.inputs).join(','), ')');
    };
    Util.keccak256 = function (value) {
        if (isHexStrict(value) && /^0x/i.test(value.toString())) {
            value = hexToBytes(value);
        }
        var returnValue = hash_1.default.keccak256(value);
        if (returnValue === KECCAK256_NULL_S) {
            return null;
        }
        else {
            return returnValue;
        }
    };
    /**
     * Returns a `Boolean` on whether or not the a `String` starts with '0x'
     * @param {String} str the string input value
     * @return {Boolean} a boolean if it is or is not hex prefixed
     * @throws if the str input is not a string
     */
    Util.isHexPrefixed = function (str) {
        if (typeof str !== 'string') {
            throw new Error('[is-hex-prefixed] value must be type \'string\', is currently type ' +
                typeof str +
                ', while checking isHexPrefixed.');
        }
        return str.slice(0, 2) === '0x';
    };
    /**
     * Removes '0x' from a given `String` is present
     * @param {String} str the string value
     * @return {String|Optional} a string by pass if necessary
     */
    Util.stripHexPrefix = function (str) {
        if (typeof str !== 'string') {
            return str;
        }
        return Util.isHexPrefixed(str) ? str.slice(2) : str;
    };
})(Util || (Util = {}));
exports.default = Util;
