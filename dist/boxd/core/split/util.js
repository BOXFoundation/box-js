"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __importDefault(require("../../util/util"));
var account_1 = __importDefault(require("../../account/account"));
var hash_1 = __importDefault(require("../../util/crypto/hash"));
var SplitUtil;
(function (SplitUtil) {
    /**
     * @func make_split_address
     * @param [*split_info] {addrs,weights,txHash,index}
     * @return [split_addr]
     */
    SplitUtil.calcSplitAddr = function (_a) {
        var addrs = _a.addrs, weights = _a.weights, txHash = _a.txHash, index = _a.index;
        /* check length */
        if (addrs.length !== weights.length) {
            throw new Error("Address count doesn't match weight count");
        }
        /* opcoder */
        var op = new util_1.default.Opcoder('');
        for (var i = 0; i < addrs.length; i++) {
            var weight = util_1.default.putUint32(Buffer.alloc(4), weights[i]);
            var pkh = Buffer.from(account_1.default.dumpPubKeyHashFromAddr(addrs[i]), 'hex');
            op.add(pkh).add(weight);
        }
        /* make raw */
        var splitHashBs = hash_1.default.ripemd160(hash_1.default.sha256(op.getCode()));
        var idxBytes = util_1.default.putUint32(Buffer.alloc(4), index);
        var hashBytes = Buffer.from(txHash, 'hex');
        var raw = Buffer.concat([hashBytes, idxBytes, splitHashBs]);
        return hash_1.default.ripemd160(hash_1.default.sha256(raw)).toString('hex');
    };
})(SplitUtil || (SplitUtil = {}));
exports.default = SplitUtil;
