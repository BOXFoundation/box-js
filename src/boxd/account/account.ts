import bitcore from 'bitcore-lib'
import { sha256, hash160 } from '../util/crypto/hash'
import {
  getCryptoJSON,
  unlockPrivateKeyWithPassphrase
} from '../util/crypto/keystore'
import bs58 from 'bs58'
import secp256k1 from 'secp256k1'
import secp_tiny from 'tiny-secp256k1'
import { newPrivateKey } from '../util/crypto/privatekey'
import { Acc } from './request'
import { CryptoJson, Crypto } from '../util/request'
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

const getCheckSum = hex => {
  return sha256(sha256(Buffer.from(hex, OP_CODE_TYPE))).slice(0, 4)
}

const getAddress = (privateKey_str: string, prefixHex: string) => {
  const privateKey = new bitcore.PrivateKey(privateKey_str)
  privateKey['pkh'] = getPubKeyHash(privateKey)
  const sha256Content = prefixHex + privateKey['pkh']
  const checksum = sha256(
    sha256(Buffer.from(sha256Content, OP_CODE_TYPE))
  ).slice(0, 4)
  const content = sha256Content.concat(checksum.toString(OP_CODE_TYPE))
  privateKey['P2PKH'] = bs58.encode(Buffer.from(content, OP_CODE_TYPE))
  return privateKey['P2PKH']
}

const getPubKeyHash = (privateKey: bitcore.PrivateKey) => {
  return hash160(privateKey.toPublicKey().toBuffer()).toString(OP_CODE_TYPE)
}

const getPubKey = (privateKey: string) => {
  return secp256k1
    .publicKeyCreate(Buffer.from(privateKey, OP_CODE_TYPE))
    .toString(OP_CODE_TYPE)
}

export default class Account {
  // import an account by KeyStore
  impAccWithKeyStore: (ksJSON: { crypto: any }, pwd: string) => any
  acc_list: { [acc_addr: string]: Acc }
  newPrivateKey: any
  updateAccount: any

  constructor(
    acc_list: { [acc_addr: string]: Acc },
    updateAccount: object = (acc_list_new: object) => {
      return acc_list_new
    }
  ) {
    this.acc_list = acc_list
    this.impAccWithKeyStore = unlockPrivateKeyWithPassphrase
    this.newPrivateKey = newPrivateKey
    this.updateAccount = updateAccount
  }

  /**
   * @func dump-P2PKH-Address-from-PrivateKey
   * @param [*privateKey] string | Buffer
   * @returns [P2PKH_Address] string
   * @memberof Account
   */
  dumpAddrFromPrivKey(privateKey: string | Buffer): any {
    try {
      if (privateKey instanceof Buffer) {
        privateKey = privateKey.toString(OP_CODE_TYPE)
      }
      if (!secp_tiny.isPrivate(Buffer.from(privateKey, 'hex'))) {
        throw new Error('Inputed privateKey type Error!')
      } else {
        return getAddress(privateKey, '1326')
      }
    } catch (err) {
      console.log('DumpAddrFromPrivKey Error:', err)
      return privateKey
    }
  }

  /**
   * @func dump-KeyStore-from-PrivateKey
   * @param [*privateKey_str] string | Buffer
   * @param [*pwd] string
   * @returns [KeyStore] CryptoJson
   * @memberof Account
   */
  dumpKeyStoreFromPrivKey(
    privateKey: string | Buffer,
    pwd: string
  ): CryptoJson {
    if (privateKey instanceof Buffer) {
      privateKey = privateKey.toString(OP_CODE_TYPE)
    }
    const privateKey_res = newPrivateKey(privateKey)
    return getCrypto(privateKey_res, pwd)
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
    const PubKey = getPubKey(privateKey)
    return PubKey
  }

  /**
   * @func dump-PublicKey-Hash-from-PrivateKey
   * @param [*privateKey] string
   * @returns [PublicKey_hash] string
   * @memberof Account
   */
  dumpPubKeyHashFromPrivKey(privateKey: string | Buffer): string {
    if (privateKey instanceof Buffer) {
      privateKey = privateKey.toString(OP_CODE_TYPE)
    }
    const privateKey_bitc: bitcore.PrivateKey = new bitcore.PrivateKey(
      privateKey
    )
    return getPubKeyHash(privateKey_bitc)
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
   * @func dump-PublicKey-Hash-from-Address
   * @param [*addr] string
   * @returns [PublicKey] string
   * @memberof Account
   */
  dumpPubKeyHashFromAddr(addr: string) {
    const decoded = bs58.decode(addr)
    if (decoded.length < 4) {
      throw new Error(`Address length: ${decoded.length} is too short`)
    }
    const len = decoded.length
    const pubKey_hash = decoded.slice(0, len - 4)
    const checksum = getCheckSum(pubKey_hash)
    if (!checksum.equals(decoded.slice(len - 4))) {
      throw new Error(`Address type error`)
    }
    return pubKey_hash.slice(2).toString(OP_CODE_TYPE)
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
