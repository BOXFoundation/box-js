"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bs58_1 = __importDefault(require("bs58"));
var var_1 = __importDefault(require("./var"));
var verify_1 = __importDefault(require("./verify"));
var hash_1 = __importDefault(require("./crypto/hash"));
var isObject_1 = __importDefault(require("lodash/isObject"));
var isArray_1 = __importDefault(require("lodash/isArray"));
var isString_1 = __importDefault(require("lodash/isString"));
var isNumber_1 = __importDefault(require("lodash/isNumber"));
var util_1 = __importDefault(require("../core/contract/abi/util"));
var util_2 = __importDefault(require("../core/split/util"));
var util_3 = __importDefault(require("../core/token/util"));
var util_4 = __importDefault(require("../core/tx/util"));
var OP_0 = var_1.default.OP_0, OP_PUSH_DATA_1 = var_1.default.OP_PUSH_DATA_1, OP_PUSH_DATA_2 = var_1.default.OP_PUSH_DATA_2, OP_PUSH_DATA_4 = var_1.default.OP_PUSH_DATA_4, OP_DUP = var_1.default.OP_DUP, OP_HASH_160 = var_1.default.OP_HASH_160, OP_EQUAL_VERIFY = var_1.default.OP_EQUAL_VERIFY, OP_CHECK_SIG = var_1.default.OP_CHECK_SIG;
var PREFIXSTR2BYTES = {
    b1: Buffer.from([0x13, 0x26]),
    b2: Buffer.from([0x13, 0x28]),
    b3: Buffer.from([0x13, 0x2a]),
    b5: Buffer.from([0x13, 0x30])
};
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
var _flattenTypes = function (includeTuple, puts) {
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
var CommonUtil;
(function (CommonUtil) {
    CommonUtil.to16StrFromNumber = function (num) { return (num & 255).toString(16); };
    CommonUtil.getBufFromNumber = function (num) { return num & 255; };
    /**
     * @func Put_Uint16
     * @param [*bytes]
     * @param [*uint16]
     * @returns [bytes]
     */
    CommonUtil.putUint16 = function (bytes, uint16) {
        if (bytes.length < 2) {
            return new Error('The length of the bytes should more than 2 !');
        }
        bytes[0] = CommonUtil.getBufFromNumber(uint16);
        bytes[1] = uint16 >> 8;
        return bytes;
    };
    var Opcoder = /** @class */ (function () {
        function Opcoder(org_code) {
            this.OP_0 = OP_0;
            this.OP_PUSH_DATA_1 = OP_PUSH_DATA_1;
            this.OP_PUSH_DATA_2 = OP_PUSH_DATA_2;
            this.OP_PUSH_DATA_4 = OP_PUSH_DATA_4;
            this.OP_DUP = OP_DUP;
            this.OP_HASH_160 = OP_HASH_160;
            this.OP_EQUAL_VERIFY = OP_EQUAL_VERIFY;
            this.OP_CHECK_SIG = OP_CHECK_SIG;
            this.opcode = Buffer.from(org_code, 'hex');
        }
        Opcoder.prototype.reset = function (org_code) {
            this.opcode = Buffer.from(org_code, 'hex');
            return this;
        };
        Opcoder.prototype.getCode = function () {
            return this.opcode;
        };
        /**
         * @export add-opcode
         * @param [*and_buf]
         * @param [?isBuf] boolean
         * @returns [opcode] Buffer
         */
        Opcoder.prototype.add = function (and_buf) {
            if (!(and_buf instanceof Buffer)) {
                and_buf = Buffer.from(and_buf, 'hex');
            }
            var and_len = and_buf.length;
            var and_len_str = CommonUtil.to16StrFromNumber(and_len);
            // console.log('and_len_str :', and_len_str)
            if (and_len < OP_PUSH_DATA_1) {
                this.opcode = Buffer.concat([
                    this.opcode,
                    Buffer.from(and_len_str, 'hex')
                ]);
            }
            else if (and_len <= 0xff) {
                this.opcode = Buffer.concat([
                    this.opcode,
                    Buffer.from(CommonUtil.to16StrFromNumber(OP_PUSH_DATA_1), 'hex'),
                    Buffer.from(and_len_str, 'hex')
                ]);
            }
            else if (and_len <= 0xffff) {
                var buf = Buffer.alloc(2);
                buf = CommonUtil.putUint16(buf, and_len);
                this.opcode = Buffer.concat([
                    this.opcode,
                    Buffer.from(CommonUtil.to16StrFromNumber(OP_PUSH_DATA_2), 'hex'),
                    buf
                ]);
            }
            else {
                var buf = Buffer.alloc(4);
                buf = CommonUtil.putUint16(buf, and_len);
                this.opcode = Buffer.concat([
                    this.opcode,
                    Buffer.from(CommonUtil.to16StrFromNumber(OP_PUSH_DATA_4), 'hex'),
                    buf
                ]);
            }
            // concat the and_buf
            this.opcode = Buffer.concat([this.opcode, and_buf]);
            return this;
        };
        return Opcoder;
    }());
    CommonUtil.Opcoder = Opcoder;
    /**
     * @func Put-Uint32
     * TODO: it not support int32 now
     * @param [*bytes]
     * @param [*uint32]
     * @returns [bytes]
     */
    CommonUtil.putUint32 = function (bytes, uint32) {
        if (bytes.length < 4) {
            return new Error('The length of the bytes should more than 4 !');
        }
        bytes[0] = CommonUtil.getBufFromNumber(uint32);
        bytes[1] = uint32 >> 8;
        bytes[2] = uint32 >> 16;
        bytes[3] = uint32 >> 24;
        return bytes;
    };
    /**
     * @func Signature-Script
     * @param [*sigBuf]
     * @param [*Buffer]
     * @returns [end]
     */
    CommonUtil.signatureScript = function (sigBuf, pubKeyBuf) {
        var op = new Opcoder([]);
        return op
            .add(sigBuf)
            .add(pubKeyBuf)
            .getCode();
    };
    /**
     * @func Get-SignHash
     * @param [*protobuf]
     * @returns
     */
    CommonUtil.getSignHash = function (protobuf) {
        if (typeof protobuf === 'string') {
            return hash_1.default.hash256(Buffer.from(protobuf, 'base64'));
        }
        else {
            return hash_1.default.hash256(protobuf);
        }
    };
    CommonUtil.jsonInterfaceMethodToString = function (json) {
        if (isObject_1.default(json) && json.name && json.name.includes('(')) {
            return json.name;
        }
        return ''
            .concat(json.name, '(')
            .concat(_flattenTypes(false, json.inputs).join(','), ')');
    };
    CommonUtil.keccak256 = function (value) {
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
     * @func # Returns a `Boolean` on whether or not the a `String` starts with '0x'
     * @param [*str] str the string input value
     * @return [boolean] a boolean if it is or is not hex prefixed
     * @throws if the str input is not a string
     */
    CommonUtil.isHexPrefixed = function (str) {
        if (typeof str !== 'string') {
            throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " +
                typeof str +
                ', while checking isHexPrefixed.');
        }
        return str.slice(0, 2) === '0x';
    };
    /**
     * @func # Removes '0x' from a given `String` is present
     * @param [*str] str the string value
     * @return [string|optional] a string by pass if necessary
     */
    CommonUtil.stripHexPrefix = function (str) {
        if (typeof str !== 'string') {
            return str;
        }
        return CommonUtil.isHexPrefixed(str) ? str.slice(2) : str;
    };
    /**
     * @func # Convert hex address to box address format
     * @param [*prefix] string # the box address prefix
     * @param [*hexAddr] string # hex address without '0x' prefix
     * @return [string] box address, starting with "b"
     * @throws when prefix is not expected
     */
    CommonUtil.hex2BoxAddr = function (prefix, hexAddr) {
        // if (!['b1', 'b2', 'b3', 'b5'].includes(prefix)) {
        //   throw new Error('Incorrect address prefix !')
        // }
        var prefixBuf = PREFIXSTR2BYTES[prefix];
        var prefixPKH = Buffer.concat([prefixBuf, Buffer.from(hexAddr, 'hex')]);
        return bs58_1.default.encode(Buffer.concat([prefixPKH, verify_1.default.getCheckSum(prefixPKH)]));
    };
    /**
     * @func Convert_box_address_to_hex_address_format
     * @param [*box_addr] string # address in box format, starting with 'b'
     * @return [string] hex address
     * @throws if convertion fails
     */
    CommonUtil.box2HexAddr = function (box_addr) {
        var pubKey_hash = verify_1.default.isBoxAddr(box_addr);
        if (pubKey_hash) {
            return pubKey_hash.slice(2).toString('hex');
        }
        else {
            throw new Error('dumpPubKeyHashFromAddr Error');
        }
    };
})(CommonUtil || (CommonUtil = {}));
exports.default = Object.assign(CommonUtil, util_1.default, util_2.default, util_3.default, util_4.default);
