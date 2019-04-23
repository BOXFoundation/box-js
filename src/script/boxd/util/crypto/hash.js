const createHash = require('create-hash');

export const ripemd160 = (buffer) => {
  return createHash('rmd160')
    .update(buffer)
    .digest();
}

export const sha1 = (buffer) => {
  return createHash('sha1')
    .update(buffer)
    .digest();
}

export const sha256 = (buffer) => {
  return createHash('sha256')
    .update(buffer)
    .digest();
}

export const hash160 = (buffer) => {
  return ripemd160(sha256(buffer));
}

export const hash256 = (buffer) => {
  return sha256(sha256(buffer));
}