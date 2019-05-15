import bitcore from 'bitcore-lib'
import bs58 from 'bs58'
import secp256k1 from 'secp256k1'
import secp_tiny from 'tiny-secp256k1'
import { sha256, hash160 } from '../util/crypto/hash'
// import { unlockPrivateKeyWithPassphrase } from '../util/crypto/keystore'
import { PrivateKey } from '../util/crypto/privatekey'
import { Acc } from './request'
import { getDerivedKey } from '../util/crypto/keystore'
import { getMac, getCiphertext } from '../util/crypto/aes'
import UtilRequest from '../util/request'

const OP_CODE_TYPE = 'hex'

const getCheckSum = (hex: string | Buffer) => {
  let result
  if (hex instanceof Buffer) {
    result = sha256(sha256(hex)).slice(0, 4)
  } else {
    result = sha256(sha256(Buffer.from(hex, OP_CODE_TYPE))).slice(0, 4)
  }
  return result
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

/**
 * @class [Account]
 * @constructs acc_list // user incoming
 * @constructs updateAccount // user incoming
 */
export default class Account {
  // import an account by KeyStore
  // impAccWithKeyStore: (ksJSON: { crypto: any }, pwd: string) => any
  acc_list: { [acc_addr: string]: Acc }
  updateAccount: any

  constructor(
    acc_list: { [acc_addr: string]: Acc },
    updateAccount: object = (new_acc_list: object) => {
      return new_acc_list
    }
  ) {
    this.acc_list = acc_list
    this.updateAccount = updateAccount
    // this.impAccWithKeyStore = unlockPrivateKeyWithPassphrase todo: export
  }

  /**
   * @func Dump-P2PKH-Address-from-PrivateKey
   * @param [*privKey] string | Buffer
   * @returns [P2PKH_Address] string
   * @memberof Account
   */
  dumpAddrFromPrivKey(privKey: string | Buffer) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OP_CODE_TYPE)
      }
      if (!secp_tiny.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('Inputed privateKey type Error!')
      } else {
        return getAddress(privKey, '1326')
      }
    } catch (err) {
      console.log('dumpAddrFromPrivKey Error:', err)
    }
  }

  /**
   * @func Dump-KeyStore-from-PrivateKey
   * @param [*privKey] string | Buffer
   * @param [*pwd] string
   * @returns [keystore] CryptoJson
   * @memberof Account
   */
  dumpKeyStoreFromPrivKey(privKey: string | Buffer, pwd: string) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OP_CODE_TYPE)
      }
      if (!secp_tiny.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('Inputed privateKey type Error!')
      } else {
        const privK = new PrivateKey(privKey)
        const keystore: UtilRequest.CryptoJson = privK.getCrypto(pwd)
        return keystore
      }
    } catch (err) {
      console.log('dumpKeyStoreFromPrivKey Error:', err)
    }
  }

  /**
   * @func Dump-PublicKey-from-PrivateKey
   * @param [*privKey] string | Buffer
   * @returns [PublicKey] string
   * @memberof Account
   */
  dumpPubKeyFromPrivKey(privKey: string | Buffer) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OP_CODE_TYPE)
      }
      if (!secp_tiny.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('Inputed privateKey type Error!')
      } else {
        return getPubKey(privKey)
      }
    } catch (err) {
      console.log('dumpPubKeyFromPrivKey Error:', err)
    }
  }

  /**
   * @func Dump-PublicKey-Hash-from-PrivateKey
   * @param [*privKey] string | Buffer
   * @returns [PublicKey_hash] string
   * @memberof Account
   */
  dumpPubKeyHashFromPrivKey(privKey: string | Buffer) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OP_CODE_TYPE)
      }
      if (!secp_tiny.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('Inputed privateKey type Error!')
      } else {
        const privKey_bitc: bitcore.PrivateKey = new bitcore.PrivateKey(privKey)
        return getPubKeyHash(privKey_bitc)
      }
    } catch (err) {
      console.log('dumpPubKeyHashFromPrivKey Error:', err)
    }
  }

  /**
   * @func Dump-PrivateKey-from-KeyStore
   * @param [*keyStore] CryptoJson
   * @param [*pwd] string
   * @returns [PrivateKey] string
   * @memberof Account
   */
  dumpPrivKeyFromKeyStore(
    keyStore: UtilRequest.CryptoJson,
    pwd: string
  ): string {
    if (!pwd) {
      throw new Error('Passphrase is require!')
    }
    if (!keyStore) {
      throw new Error('KeyStore JSON is require!')
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
      throw new Error('Wrong passphrase!')
    }
    const privateKeyHexStr = getCiphertext(
      aesKey,
      cpt.ciphertext,
      cpt.cipherparams.iv
    )
    if (!privateKeyHexStr) {
      throw new Error('Privatekey not found!')
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
}
