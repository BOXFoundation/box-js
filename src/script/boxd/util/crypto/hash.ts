import createHash from 'create-hash'

export const ripemd160 = (buf: any) => {
  return createHash('rmd160')
    .update(buf)
    .digest()
}

export const sha1 = (buf: any) => {
  return createHash('sha1')
    .update(buf)
    .digest()
}

export const sha256 = (buf: any) => {
  return createHash('sha256')
    .update(buf)
    .digest()
}

export const hash160 = (buf: any) => {
  return ripemd160(sha256(buf))
}

export const hash256 = (buf: Buffer) => {
  return sha256(sha256(buf))
}
