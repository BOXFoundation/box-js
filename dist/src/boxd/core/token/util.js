"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bs58_1 = __importDefault(require("bs58"));
var util_1 = __importDefault(require("../../util/util"));
var Util;
(function (Util) {
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
     * @param [*index] number
     * @returns [token_address] string
     */
    Util.encodeTokenAddr = function (token_addr) {
        var opHash = token_addr.opHash, index = token_addr.index;
        var before = Buffer.from(opHash, 'hex');
        var end = util_1.default.putUint32(Buffer.alloc(4), Number(index));
        return bs58_1.default.encode(Buffer.concat([before, Buffer.from(':'), end]));
    };
    /**
     * @func token_address=>hash+index
     * @param [*token_address] string
     * @returns [{hash,index}] object
     */
    Util.decodeTokenAddr = function (token_address) {
        var token_addr_buf = bs58_1.default.decode(token_address);
        var opHash = token_addr_buf.slice(0, op_hash_len).toString('hex');
        var index = getUint32(token_addr_buf.slice(op_hash_len + 1));
        return {
            opHash: opHash,
            index: index
        };
    };
})(Util || (Util = {}));
exports.default = Util;
