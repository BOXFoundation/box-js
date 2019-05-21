import bitcore from 'bitcore-lib'
import TxResponse from '../core/tx/response'

namespace Interface {
  export interface Keystore {
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
    cryptoJson: Keystore
  }

  export interface SignedTxByPrivKeyReq {
    unsignedTx: {
      tx: TxResponse.TX
      rawMsgs: string[]
    }
    privKey: string
  }

  export interface CryptoJson {
    cryptoJSON: Keystore
    update_time: number
    P2PKH: string
    name: string
  }
}

export default Interface
