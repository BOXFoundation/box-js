"use strict";
exports.__esModule = true;
var bs58_1 = require("bs58");
var util_1 = require("../../util/util");
var op_hash_len = 32;
/**
 * @func getUint32
 * @param [*buf] Buffer
 */
var getUint32 = function (buf) {
    return buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24);
};
/**
 * @export hash+index=>token_address
 * @param [*opHash] string
 * @param [*index] string
 * @returns [token_address] string
 */
exports.encodeTokenAddr = function (opHash, index) {
    var before = Buffer.from(opHash, 'hex');
    var end = util_1.putUint32(Buffer.alloc(4), Number(index));
    console.log('base58:', bs58_1["default"]);
    return bs58_1["default"].encode(Buffer.concat([before, Buffer.from(':'), end]));
};
/**
 * @func token_address=>hash+index
 * @param [*token_address] string
 * @returns [{hash,index}] object
 */
exports.decodeTokenAddr = function (token_address) {
    var token_addr_buf = bs58_1["default"].decode(token_address);
    var opHash = token_addr_buf.slice(0, op_hash_len).toString('hex');
    var index = getUint32(token_addr_buf.slice(op_hash_len + 1));
    return {
        opHash: opHash,
        index: index
    };
};
