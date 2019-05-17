import bitcore from 'bitcore-lib'

namespace Interface {
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

  export interface SignedTxByPrivKeyReq {
    unsignedTx: {
      tx: any //Response.TX
      rawMsgs: string[]
    }
    privKey: string
  }

  export interface Keystore {
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
}

export default Interface
