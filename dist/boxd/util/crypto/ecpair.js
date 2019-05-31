"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tiny_secp256k1_1 = __importDefault(require("tiny-secp256k1"));
var util_1 = __importDefault(require("../util"));
var OP_CODE_TYPE = 'hex';
var Ecpair;
(function (Ecpair) {
    function canonicalizeInt(b) {
        if (b.length === 0) {
            b = Buffer.from([0x00]);
        }
        if ((b[0] & 0x80) !== 0) {
            b = Buffer.concat([Buffer.alloc(1), b]);
        }
        return b;
    }
    function ECPair(d, Q, options) {
        options = options || {};
        this.compressed =
            options.compressed === undefined ? true : options.compressed;
        this.__d = d || null;
        this.__Q = null;
        if (Q)
            this.__Q = tiny_secp256k1_1.default.pointCompress(Q, this.compressed);
    }
    Object.defineProperty(ECPair.prototype, 'privateKey', {
        enumerable: false,
        get: function () {
            return this.__d;
        }
    });
    Object.defineProperty(ECPair.prototype, 'publicKey', {
        get: function () {
            if (!this.__Q)
                this.__Q = tiny_secp256k1_1.default.pointFromScalar(this.__d, this.compressed);
            return this.__Q;
        }
    });
    ECPair.prototype.sign = function (hash) {
        if (!this.__d)
            throw new Error('Missing private key');
        var signature = tiny_secp256k1_1.default.sign(hash, this.__d);
        return { sig: this.toCompact(signature), signature: signature };
    };
    ECPair.prototype.toCompact = function (signature) {
        var rb = canonicalizeInt(signature.slice(0, 32));
        var sb = canonicalizeInt(signature.slice(32));
        var length = 6 + rb.length + sb.length;
        var b1 = Buffer.alloc(4);
        b1[0] = 0x30;
        b1[1] = util_1.default.getNumberByte(length - 2);
        b1[2] = 0x02;
        b1[3] = util_1.default.getNumberByte(rb.length);
        var b3 = Buffer.alloc(2);
        b3[0] = 0x02;
        b3[1] = util_1.default.getNumberByte(sb.length);
        var allBytes = Buffer.concat([b1, rb, b3, sb]);
        return allBytes;
    };
    ECPair.prototype.verify = function (hash, signature) {
        return tiny_secp256k1_1.default.verify(hash, this.publicKey, signature);
    };
    Ecpair.getECfromPrivKey = function (privkey, options) {
        privkey = Buffer.from(privkey, OP_CODE_TYPE);
        if (!tiny_secp256k1_1.default.isPrivate(privkey))
            throw new TypeError('Private key not in range [1, n)');
        return new ECPair(privkey, null, options);
    };
})(Ecpair || (Ecpair = {}));
exports.default = Ecpair;