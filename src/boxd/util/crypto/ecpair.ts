import ecc from 'tiny-secp256k1'
import CommonUtil from '../util'

const OPCODE_TYPE = 'hex'

namespace Ecpair {
  function canonicalizeInt(b: Buffer | Uint8Array) {
    if (b.length === 0) {
      b = Buffer.from([0x00])
    }
    if ((b[0] & 0x80) !== 0) {
      b = Buffer.concat([Buffer.alloc(1), b])
    }
    return b
  }

  function ECPair(d: any, Q: any, options: { compressed?: any }) {
    options = options || {}

    this.compressed =
      options.compressed === undefined ? true : options.compressed
    this.__d = d || null
    this.__Q = null
    if (Q) this.__Q = ecc.pointCompress(Q, this.compressed)
  }

  Object.defineProperty(ECPair.prototype, 'privateKey', {
    enumerable: false,
    get: function() {
      return this.__d
    }
  })

  Object.defineProperty(ECPair.prototype, 'publicKey', {
    get: function() {
      if (!this.__Q) this.__Q = ecc.pointFromScalar(this.__d, this.compressed)
      return this.__Q
    }
  })

  ECPair.prototype.sign = function(hash: Buffer) {
    if (!this.__d) throw new Error('Missing private key')
    const signature = ecc.sign(hash, this.__d)
    return { sig: this.toCompact(signature), signature }
  }

  ECPair.prototype.toCompact = function(signature: any) {
    const rb = canonicalizeInt(signature.slice(0, 32))
    const sb = canonicalizeInt(signature.slice(32))

    const length = 6 + rb.length + sb.length

    const b1 = Buffer.alloc(4)
    b1[0] = 0x30
    b1[1] = CommonUtil.getBufFromNumber(length - 2)
    b1[2] = 0x02
    b1[3] = CommonUtil.getBufFromNumber(rb.length)

    const b3 = Buffer.alloc(2)
    b3[0] = 0x02
    b3[1] = CommonUtil.getBufFromNumber(sb.length)

    const allBytes = Buffer.concat([b1, rb, b3, sb])
    return allBytes
  }

  ECPair.prototype.verify = function(hash: any, signature: any) {
    return ecc.verify(hash, this.publicKey, signature)
  }

  export const getECfromPrivKey = function(privkey, options?: any) {
    privkey = Buffer.from(privkey, OPCODE_TYPE)
    if (!ecc.isPrivate(privkey))
      throw new TypeError('Private key not in range [1, n)')
    return new ECPair(privkey, null, options)
  }
}

export default Ecpair
