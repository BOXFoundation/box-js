import bitcore from 'bitcore-lib'

export interface Acc {
  cryptoJSON: {
    id: string
    address: string
    crypto: {
      cipher: string
      ciphertext: string
      cipherparams: {
        iv: string
      }
      mac: string
      kdfparams: {
        salt: string
        n: number
        r: number
        p: number
        dklen: number
      }
    }
  }
  update_time: number
  P2PKH: string
  name: string
}

export interface CryptoJSON {
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
  cryptoJson: CryptoJSON
}
