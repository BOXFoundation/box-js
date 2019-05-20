import bs58 from 'bs58'
import tinySecp from 'tiny-secp256k1'
import Hash from '../util/crypto/hash'
import Keystore from '../util/crypto/keystore'
import Aes from '../util/crypto/aes'
import PrivateKey from '../util/crypto/privatekey'
import UtilInterface from '../util/interface'

const OP_CODE_TYPE = 'hex'

const getCheckSum = (hex: string | Buffer) => {
  if (hex instanceof Buffer) {
    return Hash.sha256(Hash.sha256(hex)).slice(0, 4)
  } else {
    return Hash.sha256(Hash.sha256(Buffer.from(hex, OP_CODE_TYPE))).slice(0, 4)
  }
}

/**
 * @class [Account]
 */
export default class Account {
  constructor() {}

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
      if (!tinySecp.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('The private key entered is not a valid one !')
      } else {
        const privK = new PrivateKey(privKey)
        return privK.privKey.toP2PKHAddress
      }
    } catch (err) {
      console.log('dumpAddrFromPrivKey Error:', err)
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
      if (!tinySecp.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('The private key entered is not a valid one !')
      } else {
        const privK = new PrivateKey(privKey)
        return privK.privKey.toPublicKey().toString(OP_CODE_TYPE)
      }
    } catch (err) {
      console.log('dumpPubKeyFromPrivKey Error:', err)
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
      if (!tinySecp.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('The private key entered is not a valid one !')
      } else {
        const privK = new PrivateKey(privKey)
        const keystore: UtilInterface.CryptoJson = privK.getCryptoByPrivKey(pwd)
        return keystore
      }
    } catch (err) {
      console.log('dumpKeyStoreFromPrivKey Error:', err)
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
      if (!tinySecp.isPrivate(Buffer.from(privKey, OP_CODE_TYPE))) {
        throw new Error('The private key entered is not a valid one !')
      } else {
        const privK = new PrivateKey(privKey)
        return privK.privKey.pkh
      }
    } catch (err) {
      console.log('dumpPubKeyHashFromPrivKey Error:', err)
    }
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
      throw new Error(`Address length = ${decoded.length}: is too short !`)
    }
    const len = decoded.length
    const pubKey_hash = decoded.slice(0, len - 4)
    const checksum = getCheckSum(pubKey_hash)
    if (!checksum.equals(decoded.slice(len - 4))) {
      throw new Error(`Incorrect address format !`)
    }
    return pubKey_hash.slice(2).toString(OP_CODE_TYPE)
  }

  /**
   * @func Dump-PrivateKey-from-KeyStore
   * @param [*key_store] CryptoJson
   * @param [*pwd] string
   * @returns [PrivateKey] string
   * @memberof Account
   */
  public async dumpPrivKeyFromKeyStore(
    key_store: UtilInterface.CryptoJson,
    pwd: string
  ) {
    const cpt = key_store.crypto
    const kdfParams = cpt.kdfparams
    const saltBuffer = Buffer.from(kdfParams.salt, OP_CODE_TYPE)
    const derivedKey = Keystore.getDerivedKey(
      pwd,
      saltBuffer,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dklen
    )
    const aesKey = derivedKey.slice(0, 16).toString(OP_CODE_TYPE)
    const sha256Key = derivedKey.slice(16, 32).toString(OP_CODE_TYPE)
    const mac = Aes.getMac(sha256Key, cpt.ciphertext)
    if (mac !== cpt.mac) {
      throw new Error('Wrong passphrase !')
    }
    const privateKeyHexStr = await Aes.getCiphertext(
      aesKey,
      cpt.ciphertext,
      cpt.cipherparams.iv
    )
    if (!privateKeyHexStr) {
      throw new Error('Private key not found !')
    }
    return privateKeyHexStr
  }

  /**
   * @func get-Crypto-Account
   * @param [*pwd] string
   * @param [*privateKey_str] string
   * @returns {} Crypto
   * @memberof Account
   */
  getCryptoByPwd(pwd: string, privateKey_str?: string) {
    const privK = new PrivateKey(privateKey_str)
    const cryptoJson = privK.getCryptoByPrivKey(pwd)
    return {
      P2PKH: privK.privKey.toP2PKHAddress,
      P2SH: privK.privKey.toP2SHAddress,
      privateKey: privK.privKey,
      cryptoJson
    }
  }
}
