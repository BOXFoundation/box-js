import * as ecc from 'tiny-secp256k1'
import { getNumberByte } from '../util'

const canonicalizeInt = (b: Buffer | Uint8Array) => {
  if (b.length === 0) {
    b = Buffer.from([0x00])
  }
  if ((b[0] & 0x80) !== 0) {
    b = Buffer.concat([Buffer.alloc(1), b])
  }
  return b
}

const ECPair = (d: any, Q: any, options: { compressed?: any }) => {
  options = options || {}

  this.compressed = options.compressed === undefined ? true : options.compressed
  this.__d = d || null
  this.__Q = null
  if (Q) this.__Q = ecc.pointCompress(Q, this.compressed)
}

Object.defineProperty(ECPair.prototype, 'privateKey', {
  enumerable: false,
  get: () => {
    return this.__d
  }
})

Object.defineProperty(ECPair.prototype, 'publicKey', {
  get: () => {
    if (!this.__Q) this.__Q = ecc.pointFromScalar(this.__d, this.compressed)
    return this.__Q
  }
})

ECPair.prototype.sign = (hash: any) => {
  if (!this.__d) throw new Error('Missing private key')
  const signature = ecc.sign(hash, this.__d)
  return {
    sig: this.toCompact(signature),
    signature
  }
}

ECPair.prototype.toCompact = (signature: any) => {
  const rb = canonicalizeInt(signature.slice(0, 32))
  const sb = canonicalizeInt(signature.slice(32))

  const length = 6 + rb.length + sb.length

  const b1 = Buffer.alloc(4)
  b1[0] = 0x30
  b1[1] = getNumberByte(length - 2)
  b1[2] = 0x02
  b1[3] = getNumberByte(rb.length)

  const b3 = Buffer.alloc(2)
  b3[0] = 0x02
  b3[1] = getNumberByte(sb.length)

  const allBytes = Buffer.concat([b1, rb, b3, sb])
  return allBytes
}

ECPair.prototype.verify = (hash: any, signature: any) => {
  return ecc.verify(hash, this.publicKey, signature)
}

export const fromPrivateKey = (buffer: Buffer, options?: any) => {
  if (!ecc.isPrivate(buffer))
    throw new TypeError('Private key not in range [1, n)')
  return new ECPair(buffer, null, options)
}