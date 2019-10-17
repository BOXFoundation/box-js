import Util from '../util'
import * as ecc from 'secp256k1'

const EC = require('elliptic').ec
const ec = new EC('secp256k1')

namespace Ecpair {
  function canonicalizeInt(b: Buffer | Uint8Array) {
    if (b.length === 0) {
      b = Buffer.from([0x00])
    }
    if ((b[0] & 0x80) !== 0) {
      console.log('=> 0x80')
      b = Buffer.concat([Buffer.alloc(1), b])
    }
    return b
  }

  function ECPair(d, options: { compressed? }) {
    options = options || {}

    this.compressed =
      options.compressed === undefined ? true : options.compressed
    this.__d = d || null
    this.__Q = null
    // if (Q) this.__Q = ecc.pointCompress(Q, this.compressed)
  }

  Object.defineProperty(ECPair.prototype, 'privateKey', {
    enumerable: false,
    get: function() {
      return this.__d
    }
  })

  /*   Object.defineProperty(ECPair.prototype, 'publicKey', {
    get: function() {
      if (!this.__Q) this.__Q = ecc.pointFromScalar(this.__d, this.compressed)
      return this.__Q
    }
  }) */

  ECPair.prototype.sign = function(raw_hash: Buffer) {
    console.log('ECPair sign hash :', raw_hash)
    if (!this.__d) throw new Error('Missing private key')
    var ec_res = ec.sign(raw_hash, this.__d, {
      canonical: true,
      k: null,
      pers: null
    })
    console.log('ECPair result :', JSON.stringify(ec_res))
    console.log('ECPair result.r.length :', ec_res.r.length)
    console.log('ECPair result.s.length :', ec_res.s.length)

    /* const signature = ecc.sign(raw_hash, this.__d)
    console.log('ecc signature :', signature.signature)
    console.log('ecc recovery :', signature.recovery) */

    return {
      sig: this.toCompact(ec_res.r.toString('hex'), ec_res.s.toString('hex')),
      raw_hash
    }
  }

  ECPair.prototype.toCompact = function(r, s) {
    console.log('toCompact r :', r)
    console.log('toCompact s :', s)
    // 序列化
    const r_buf = canonicalizeInt(Buffer.from(r, 'hex'))
    const s_buf = canonicalizeInt(Buffer.from(s, 'hex'))
    console.log('rb.length :', r_buf.length)
    console.log('sb.length :', s_buf.length)

    // 128 时补零
    const rneg = r_buf[0] & 0x80 ? true : false
    const sneg = s_buf[0] & 0x80 ? true : false

    const rb = rneg ? Buffer.concat([Buffer.from([0x00]), r_buf]) : r_buf
    const sb = sneg ? Buffer.concat([Buffer.from([0x00]), s_buf]) : s_buf

    // 校验 signature长度
    const length = 6 + rb.length + sb.length

    const b1 = Buffer.alloc(4)
    b1[0] = 0x30
    b1[1] = Util.getBufFromNumber(length - 2)
    b1[2] = 0x02
    b1[3] = Util.getBufFromNumber(rb.length)

    const b3 = Buffer.alloc(2)
    b3[0] = 0x02
    b3[1] = Util.getBufFromNumber(sb.length)

    return Buffer.concat([b1, rb, b3, sb])
  }

  ECPair.prototype.verify = function(sigHash, signature, publicKey) {
    return ecc.verify(sigHash, signature, publicKey)
  }

  export const getECfromPrivKey = function(privkey, options?) {
    // console.log('==> getECfromPrivKey')
    privkey = Buffer.from(privkey, 'hex')

    if (!ecc.privateKeyVerify(privkey))
      throw new TypeError('Private key not in range [1, n)')
    return new ECPair(privkey, options)
  }
}

export default Ecpair
