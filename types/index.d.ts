// Type definitions for box-js 1.1.0
import bitcore from 'bitcore-lib'

export interface cryptoJSON {
  id: string
  address: string
  crypto: {
    ciphertext: string
    cipher: string
    cipherparams: {
      iv: string
    }
    mac: string
    kdfparams: {
      salt: string
      dklen: number
      n: number
      r: number
      p: number
    }
  }
}

export class Wallet {
  readonly walletList: object

  unlockPrivateKeyWithPassphrase(
    cryptoJSON: cryptoJSON,
    password: string
  ): string

  createWallet(
    password: string,
    privateKeyHexStr?: string
  ): { cryptoJSON: cryptoJSON; privateKey: bitcore.PrivateKey }

  getCrypto(privateKey: bitcore.PrivateKey, password: string): cryptoJSON

  addToAccList(cryptoJSON: cryptoJSON, otherInfo?: object): null

  listWallets(): string[]
}

interface HashBuffer {
  (buffer: Buffer): Buffer
}

export interface hash {
  hash160: HashBuffer
  hash256: HashBuffer
  ripemd160: HashBuffer
  sha1: HashBuffer
  sha256: HashBuffer
}

declare module 'base58' {
  export function encode()

  export function decode()
}
