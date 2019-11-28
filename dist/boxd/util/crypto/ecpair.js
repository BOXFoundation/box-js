"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __importDefault(require("../util"));
var ecc = __importStar(require("secp256k1"));
var bn_js_1 = __importDefault(require("bn.js"));
var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var Ecpair;
(function (Ecpair) {
    function canonicalizeInt(b) {
        if (b.length === 0) {
            b = Buffer.from([0x00]);
        }
        if ((b[0] & 0x80) !== 0) {
            // console.log("=> 0x80")
            b = Buffer.concat([Buffer.alloc(1), b]);
        }
        return b;
    }
    Ecpair.canonicalizeInt = canonicalizeInt;
    function ECPair(d, options) {
        options = options || {};
        this.compressed =
            options.compressed === undefined ? true : options.compressed;
        this.__d = d || null;
        this.__Q = null;
        // if (Q) this.__Q = ecc.pointCompress(Q, this.compressed)
    }
    Object.defineProperty(ECPair.prototype, "privateKey", {
        enumerable: false,
        get: function () {
            return this.__d;
        }
    });
    /*   Object.defineProperty(ECPair.prototype, 'publicKey', {
      get: function() {
        if (!this.__Q) this.__Q = ecc.pointFromScalar(this.__d, this.compressed)
        return this.__Q
      }
    }) */
    ECPair.prototype.sign = function (raw_hash) {
        if (!this.__d)
            throw new Error("Missing private key");
        var ec_res = ec.sign(raw_hash, this.__d, {
            canonical: true,
            k: null,
            pers: null
        });
        // r or s is big number
        /* const signature = ecc.sign(raw_hash, this.__d)
        console.log('ecc signature :', signature.signature)
        console.log('ecc recovery :', signature.recovery) */
        return {
            sig: this.toCompact(new bn_js_1.default(ec_res.r).toArrayLike(Buffer), new bn_js_1.default(ec_res.s).toArrayLike(Buffer)),
            raw_hash: raw_hash
        };
    };
    ECPair.prototype.toCompact = function (r, s) {
        // console.log('toCompact r :', r.toString('hex'))
        // console.log('toCompact s :', s.toString('hex'))
        // 序列化
        var r_buf = canonicalizeInt(r);
        var s_buf = canonicalizeInt(s);
        // console.log("rb.length :", r_buf.length)
        // console.log("sb.length :", s_buf.length)
        // 128 时补零
        var rneg = r_buf[0] & 0x80 ? true : false;
        var sneg = s_buf[0] & 0x80 ? true : false;
        var rb = rneg ? Buffer.concat([Buffer.from([0x00]), r_buf]) : r_buf;
        var sb = sneg ? Buffer.concat([Buffer.from([0x00]), s_buf]) : s_buf;
        // 校验 signature长度
        var length = 6 + rb.length + sb.length;
        var b1 = Buffer.alloc(4);
        b1[0] = 0x30;
        b1[1] = util_1.default.getBufFromNumber(length - 2);
        b1[2] = 0x02;
        b1[3] = util_1.default.getBufFromNumber(rb.length);
        var b3 = Buffer.alloc(2);
        b3[0] = 0x02;
        b3[1] = util_1.default.getBufFromNumber(sb.length);
        return Buffer.concat([b1, rb, b3, sb]);
    };
    ECPair.prototype.verify = function (sigHash, signature, publicKey) {
        return ecc.verify(sigHash, signature, publicKey);
    };
    Ecpair.getECfromPrivKey = function (privkey, options) {
        // console.log('==> getECfromPrivKey')
        privkey = Buffer.from(privkey, "hex");
        if (!ecc.privateKeyVerify(privkey))
            throw new TypeError("Private key not in range [1, n)");
        return new ECPair(privkey, options);
    };
})(Ecpair || (Ecpair = {}));
exports.default = Ecpair;
