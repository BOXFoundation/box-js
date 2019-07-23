import CryptoJson from '../util/crypto/crypto-json'
import Aes from '../util/crypto/aes'
import PrivateKey from '../util/crypto/privatekey'
import Verify from '../util/verify'
import UtilInterface from '../util/interface'
import Util from '../util/util'

const OPCODE_TYPE = 'hex'

/**
 * @class [Account]
 */
export default class Account {
  /**
   * @func Dump-P2PKH-address-from-privateKey
   * @param [*privKey] string | Buffer
   * @returns [P2PKH_Address] string
   * @memberof Account
   */
  public dumpAddrFromPrivKey(privKey: string | Buffer) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OPCODE_TYPE)
      }
      if (Verify.isPrivate(privKey)) {
        const privK = new PrivateKey(privKey)
        return privK.privKey.toP2PKHAddress
      }
    } catch (err) {
      console.log('dumpAddrFromPrivKey Error !')
      throw new Error(err)
    }
  }

  /**
   * @func Dump-PublicKey-from-PrivateKey
   * @param [*privKey] string | Buffer
   * @returns [PublicKey] string
   * @memberof Account
   */
  public dumpPubKeyFromPrivKey(privKey: string | Buffer) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OPCODE_TYPE)
      }
      if (Verify.isPrivate(privKey)) {
        const privK = new PrivateKey(privKey)
        return privK.privKey.toPublicKey().toString(OPCODE_TYPE)
      }
    } catch (err) {
      console.log('dumpPubKeyFromPrivKey Error !')
      throw new Error(err)
    }
  }

  /**
   * @func Dump-Crypto-from-PrivateKey
   * @param [*privKey] string | Buffer
   * @param [*pwd] string
   * @returns [CryptoJson] CryptoJson
   * @memberof Account
   */
  public dumpCryptoFromPrivKey(privKey: string | Buffer, pwd: string) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OPCODE_TYPE)
      }
      if (Verify.isPrivate(privKey)) {
        const privK = new PrivateKey(privKey)
        return privK.getCryptoByPrivKey(pwd)
      }
    } catch (err) {
      console.log('dumpKeyStoreFromPrivKey Error !')
      throw new Error(err)
    }
  }

  /**
   * @func Dump-PublicKey-Hash-from-PrivateKey
   * @param [*privKey] string | Buffer
   * @returns [PublicKey_hash] string
   * @memberof Account
   */
  public dumpPubKeyHashFromPrivKey(privKey: string | Buffer) {
    try {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString(OPCODE_TYPE)
      }
      if (Verify.isPrivate(privKey)) {
        const privK = new PrivateKey(privKey)
        return privK.privKey.pkh
      }
    } catch (err) {
      console.log('dumpPubKeyHashFromPrivKey Error !')
      throw new Error(err)
    }
  }

  /**
   * @func dump-PublicKey-Hash-from-Address
   * @param [*addr] string
   * @returns [PublicKey] string
   * @memberof Account
   */
  public dumpPubKeyHashFromAddr(addr: string) {
    return Util.box2HexAddr(addr)
  }

  /**
   * @func Dump-PrivateKey-from-Crypto
   * @param [*key_store] CryptoJson
   * @param [*pwd] string
   * @returns [PrivateKey] string
   * @memberof Account
   */
  public async dumpPrivKeyFromCrypto(
    cryptoJSON: UtilInterface.Crypto,
    pwd: string
  ) {
    // console.log('dumpPrivKeyFromCrypto param:', cryptoJSON, pwd)
    try {
      const cpt = cryptoJSON.crypto
      const kdfParams = cpt.kdfparams
      const saltBuffer = Buffer.from(kdfParams.salt, OPCODE_TYPE)
      const derivedKey = CryptoJson.getDerivedKey(
        pwd,
        saltBuffer,
        kdfParams.n,
        kdfParams.r,
        kdfParams.p,
        kdfParams.dklen
      )
      const aesKey = derivedKey.slice(0, 16).toString(OPCODE_TYPE)
      const sha256Key = derivedKey.slice(16, 32).toString(OPCODE_TYPE)
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
        throw new Error('Privat Key not found !')
      }
      return privateKeyHexStr
    } catch (err) {
      console.log('dumpPrivKeyFromCrypto Error !')
      throw new Error(err)
    }
  }

  /**
   * @func get-Crypto-Account
   * @param [*pwd] string
   * @param [*privateKey_str] string
   * @returns {} Crypto
   * @memberof Account
   */
  public getCryptoByPwd(pwd: string, privKey?: string | Buffer) {
    if (privKey && privKey instanceof Buffer) {
      privKey = privKey.toString(OPCODE_TYPE)
    }
    const privK = new PrivateKey(privKey)
    const cryptoJSON = privK.getCryptoByPrivKey(pwd)
    return {
      P2PKH: privK.privKey.toP2PKHAddress,
      P2SH: privK.privKey.toP2SHAddress,
      privateKey: privK.privKey,
      cryptoJSON
    }
  }
}
