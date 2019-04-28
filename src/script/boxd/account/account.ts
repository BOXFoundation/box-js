import { RpcError, Rpc } from '../util/util'
import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from '../util/crypto/keystore'

export default class Account extends Rpc {
  unlockPrivateKeyWithPassphrase: (
    ksJSON: { crypto: any },
    passphrase: any
  ) => any
  walletsMap: {}
  newPrivateKey: any
  onUpdate: any

  constructor({ walletsMap = {}, onUpdate }) {
    super()
    this.unlockPrivateKeyWithPassphrase = unlockPrivateKeyWithPassphrase
    this.walletsMap = walletsMap
    this.newPrivateKey = newPrivateKey
    this.onUpdate = onUpdate
  }
}
