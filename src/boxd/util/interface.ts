import TxResponse from '../core/tx/response'

namespace Interface {
  export interface Crypto {
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

  export interface SignedTxByPrivKeyReq {
    unsignedTx: {
      tx: TxResponse.TX
      rawMsgs: string[]
    }
    privKey: string
  }

  export interface Account {
    cryptoJSON: Crypto
    update_time: number
    P2PKH: string
    name: string
  }
}

export default Interface
