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
exports.__esModule = true;
var core_1 = require("./core");
var hash_1 = require("./crypto/hash");
var OP_PUSH_DATA1 = core_1.opcode.OP_PUSH_DATA1, OP_PUSH_DATA2 = core_1.opcode.OP_PUSH_DATA2, OP_PUSH_DATA4 = core_1.opcode.OP_PUSH_DATA4;
exports.getNumberByte = function (num) { return num & 255; };
var gethexByteWithNumber = function (num) { return (num & 255).toString(16); };
/**
 * @export putUint16
 * @param [*bytes]
 * @param [*uint16]
 * @returns [bytes]
 */
exports.putUint16 = function (bytes, uint16) {
    if (bytes === void 0) { bytes = []; }
    if (bytes.length < 2) {
        return new Error('The length of the bytes should more than 2!');
    }
    bytes[0] = exports.getNumberByte(uint16);
    bytes[1] = uint16 >> 8;
    return bytes;
};
/**
 * @export putUint32
 * TODO: it not support int32 now!!!
 * @param [*bytes]
 * @param [*uint32]
 * @returns [bytes]
 */
exports.putUint32 = function (bytes, uint32) {
    if (bytes === void 0) { bytes = []; }
    if (bytes.length < 4) {
        return new Error('The length of the bytes should more than 4!');
    }
    bytes[0] = exports.getNumberByte(uint32);
    bytes[1] = uint32 >> 8;
    bytes[2] = uint32 >> 16;
    bytes[3] = uint32 >> 24;
    return bytes;
};
/**
 * @export addOperand
 * @param [*strBuf] Buffer | Uint8Array
 * @param [*operand] Buffer
 * @returns Buffer
 */
function addOperand(strBuf, operand) {
    var dataLen = operand.length;
    var dataLen_str = gethexByteWithNumber(dataLen);
    if (dataLen < OP_PUSH_DATA1) {
        strBuf = Buffer.from(strBuf.toString('hex') + dataLen_str, 'hex');
    }
    else if (dataLen <= 0xff) {
        strBuf = Buffer.concat([
            strBuf,
            Buffer.from(gethexByteWithNumber(OP_PUSH_DATA1), 'hex'),
            Buffer.from(dataLen_str, 'hex')
        ]);
    }
    else if (dataLen <= 0xffff) {
        var buf = Buffer.alloc(2);
        buf = exports.putUint16(buf, dataLen);
        strBuf = Buffer.concat([
            strBuf,
            Buffer.from(gethexByteWithNumber(OP_PUSH_DATA2), 'hex'),
            buf
        ]);
    }
    else {
        var buf = Buffer.alloc(4);
        buf = exports.putUint16(buf, dataLen);
        strBuf = Buffer.concat([
            strBuf,
            Buffer.from(gethexByteWithNumber(OP_PUSH_DATA4), 'hex'),
            buf
        ]);
    }
    // Append the actual operand
    return Buffer.concat([strBuf, operand]);
}
exports.addOperand = addOperand;
/**
 * @export signatureScript
 * @param [*sigBuf] Buffer
 * @param [*Buffer] Buffer
 * @returns [end] Buffer
 */
exports.signatureScript = function (sigBuf, pubKeyBuf) {
    var before = addOperand(Buffer.from([]), sigBuf);
    var end = addOperand(before, pubKeyBuf);
    console.log('before:', before.toString('hex'));
    return end;
};
/**
 * @export getSignHash
 * @param [*protobuf] string
 * @returns
 */
exports.getSignHash = function (protobuf) {
    return hash_1.hash256(Buffer.from(protobuf, 'base64'));
};
/**
 * @exportClass [Rpc-Error]
 * @extends Error
 */
var RpcError = /** @class */ (function (_super) {
    __extends(RpcError, _super);
    // Detailed error information
    function RpcError(json) {
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
        Object.setPrototypeOf(_this, RpcError.prototype);
        _this.json = json;
        return _this;
    }
    return RpcError;
}(Error));
exports.RpcError = RpcError;
