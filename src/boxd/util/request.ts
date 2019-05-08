import bitcore from 'bitcore-lib'

export interface CryptoJson {
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

export interface Crypto {
  P2PKH: string
  P2SH: string
  privateKey: bitcore.PrivateKey
  cryptoJson: CryptoJson
}
