import bitcore from 'bitcore-lib'
import { sha256, hash160 } from '../util/crypto/hash'
import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from '../util/crypto/keystore'
import bs58 from 'bs58'
import { newPrivateKey } from '../util/crypto/privatekey'
import { Acc } from './interface'
import { CryptoJson, Crypto } from '../util/interface'
import { getDerivedKey } from '../util/crypto/keystore'
import { getMac, getCiphertext } from '../util/crypto/aes'

const OP_CODE_TYPE = 'hex'

/**
 * @func get-cryptoJson-with-privateKey&password
 * @param [*privateKey] {toString, toP2PKHAddress}
 * @param [*pwd] string
 * @returns [cryptoJson]
 */
const getCrypto = (
  privateKey: {
    toString: (arg0: string) => string
    toP2PKHAddress: () => string
  },
  pwd: string
) => {
  return getCryptoJSON(privateKey, pwd)
}

const getAddress = (_this: bitcore.PrivateKey, prefixHex: string) => {
  return function() {
    const sha256Content = prefixHex + this.pkh
    const checksum = sha256(
      sha256(Buffer.from(sha256Content, OP_CODE_TYPE))
    ).slice(0, 4)
    const content = sha256Content.concat(checksum.toString(OP_CODE_TYPE))
    this.P2PKHAddress = bs58.encode(Buffer.from(content, OP_CODE_TYPE))
    return this.P2PKHAddress
  }.bind(_this)
}

const getPublicAddress = (privateKey: bitcore.PrivateKey) => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString('hex')
}

export default class Account {
  // import an account by KeyStore
  impAccWithKeyStore: (ksJSON: { crypto: any }, pwd: string) => any
  acc_list: { [acc_addr: string]: Acc }
  newPrivateKey: any
  updateAccount: any

  constructor(
    acc_list: { [acc_addr: string]: Acc },
    updateAccount: object = (new_acc_list: object) => {
      return new_acc_list
    }
  ) {
    this.acc_list = acc_list
    this.impAccWithKeyStore = unlockPrivateKeyWithPassphrase
    this.newPrivateKey = newPrivateKey
    this.updateAccount = updateAccount
  }

  /**
   * @func dump-P2PKHAddress-from-PrivateKey
   * @param [*privateKey] string | Buffer
   * @returns [P2PKH_Address] string
   * @memberof Account
   */
  dumpAddrFromPrivKey(privateKey: string | Buffer): string {
    if (privateKey instanceof Buffer) {
      privateKey = privateKey.toString(OP_CODE_TYPE)
    }
    const privateKey_bitc: any = new bitcore.PrivateKey(privateKey)
    return getAddress(privateKey_bitc, '1326')
  }

  /**
   * @func dump-KeyStore-from-PrivateKey
   * @param [*privateKey_str] string
   * @param [*pwd] string
   * @returns [KeyStore] CryptoJson
   * @memberof Account
   */
  dumpKeyStoreFromPrivKey(privateKey_str: string, pwd: string): CryptoJson {
    const privateKey = newPrivateKey(privateKey_str)
    return getCrypto(privateKey, pwd)
  }

  /**
   * @func dump-PrivateKey-from-KeyStore
   * @param [*keyStore] CryptoJson
   * @param [*pwd] string
   * @returns [PrivateKey] string
   * @memberof Account
   */
  dumpPrivKeyFromKeyStore(keyStore: CryptoJson, pwd: string): string {
    if (!pwd) {
      throw new Error('Passphrase is require!')
    }
    if (!keyStore) {
      throw new Error('ksJSON is require!')
    }
    const cpt = keyStore.crypto
    const kdfParams = cpt.kdfparams
    const saltBuffer = Buffer.from(kdfParams.salt, OP_CODE_TYPE)
    const derivedKey = getDerivedKey(
      pwd,
      saltBuffer,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dklen
    )

    const aesKey = derivedKey.slice(0, 16).toString(OP_CODE_TYPE)
    const sha256Key = derivedKey.slice(16, 32).toString(OP_CODE_TYPE)
    const mac = getMac(sha256Key, cpt.ciphertext)
    if (mac !== cpt.mac) {
      throw new Error('passphrase is error!')
    }
    const privateKeyHexStr = getCiphertext(
      aesKey,
      cpt.ciphertext,
      cpt.cipherparams.iv
    )
    if (!privateKeyHexStr) {
      throw new Error("Can't find privateKey!")
    }
    return privateKeyHexStr
  }

  /**
   * @func dump-PublicKey-from-PrivateKey
   * @param [*privateKey] string | Buffer
   * @returns [PublicKey] string
   * @memberof Account
   */
  dumpPubKeyFromPrivKey(privateKey: string | Buffer): string {
    if (privateKey instanceof Buffer) {
      privateKey = privateKey.toString(OP_CODE_TYPE)
    }
    const privateKey_bitc: any = new bitcore.PrivateKey(privateKey)
    return getPublicAddress(privateKey_bitc)
  }

  /**
   * @func dump-PublicKey-from-Address
   * @param [*addr] string
   * @returns [PublicKey] string
   * @memberof Account
   */
  dumpPubKeyHashFromAddr() {
    // todo
  }

  /**
   * @func dump-PublicKey-from-Address
   * @param [*privateKey] string
   * @returns [PublicKey] string
   * @memberof Account
   */
  dumpPubKeyHashFromPrivKey(privateKey: string | Buffer) {
    if (privateKey instanceof Buffer) {
      privateKey = privateKey.toString(OP_CODE_TYPE)
    }
    // todo
  }

  /**
   * @func get-Crypto-Account
   * @param [*pwd] string
   * @param [*privateKey_str] string
   * @returns {} Crypto
   * @memberof Account
   */
  getCryptoAcc(pwd: string, privateKey_str?: string): Crypto {
    const privateKey = newPrivateKey(privateKey_str)
    const cryptoJson = getCrypto(privateKey, pwd)
    return {
      P2PKH: privateKey.toP2PKHAddress(),
      P2SH: privateKey.toP2SHAddress(),
      privateKey,
      cryptoJson
    }
  }

  /**
   * @func add-new-wallet-to-walletList
   * @param {*cryptoJson} { address ... }
   * @memberof Account
   */
  addToAccList(cryptoJson: { address: string }, otherInfo: any): void {
    const address = cryptoJson.address
    const update_time = Date.now()
    if (this.acc_list[address]) {
      console.warn('This Account already existed. It will be rewrited...')
    }
    this.acc_list[address] = {
      cryptoJson,
      ...{
        update_time
      },
      ...otherInfo
    }
    this.updateAccount && this.updateAccount(this.acc_list)
  }

  sortAccList() {
    return Object.values(this.acc_list).sort(
      (a, b) => a.update_time - b.update_time
    )
  }
}
