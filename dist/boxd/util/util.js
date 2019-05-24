"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var var_1 = require("./var");
var hash_1 = __importDefault(require("./crypto/hash"));
var OP_PUSH_DATA1 = var_1.opcode.OP_PUSH_DATA1, OP_PUSH_DATA2 = var_1.opcode.OP_PUSH_DATA2, OP_PUSH_DATA4 = var_1.opcode.OP_PUSH_DATA4;
var OP_CODE_TYPE = 'hex';
var gethexByteWithNumber = function (num) { return (num & 255).toString(16); };
var Util;
(function (Util) {
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
})(Util || (Util = {}));
exports.default = Util;
