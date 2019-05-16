namespace Request {
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
}
export default Request
