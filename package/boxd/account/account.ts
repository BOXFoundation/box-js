import CryptoJson from '../util/crypto/crypto-json'
import Aes from '../util/crypto/aes'
import PrivateKey from '../util/crypto/privatekey'
import Verify from '../util/verify'
import UtilInterface from '../util/interface'
import Util from '../util/util'

namespace Account {
  /**
   * @func Dump_P2PKH_address_from_privateKey
   * @param [*privKey]
   * @returns [P2PKH_address]
   * @memberof Account
   */
  export const dumpAddrFromPrivKey = (privKey: string | Buffer) => {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex')
    }
    if (Verify.isPrivate(privKey)) {
      const privK = new PrivateKey(privKey)
      return privK.privKey.toP2PKHAddress
    } else {
      throw new Error('Private key format error !')
    }
  }

  /**
   * @func Dump_publicKey_from_privateKey
   * @param [*privKey]
   * @returns [publicKey]
   * @memberof Account
   */
  export const dumpPubKeyFromPrivKey = (privKey: string | Buffer) => {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex')
    }
    if (Verify.isPrivate(privKey)) {
      const privK = new PrivateKey(privKey)
      return privK.privKey.toPublicKey().toString('hex')
    } else {
      throw new Error('Private key format error !')
    }
  }

  /**
   * @func Dump_cryptoJson_from_privateKey
   * @param [*privKey]
   * @param [*pwd]
   * @returns [cryptoJson]
   * @memberof Account
   */
  export const dumpCryptoFromPrivKey = (
    privKey: string | Buffer,
    pwd: string
  ) => {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex')
    }
    if (Verify.isPrivate(privKey)) {
      const privK = new PrivateKey(privKey)
      return privK.getCryptoByPrivKey(pwd)
    } else {
      throw new Error('Private key format error !')
    }
  }

  /**
   * @func Dump_publicKey_hash_from_privateKey
   * @param [*privKey]
   * @returns [publicKey_hash]
   * @memberof Account
   */
  export const dumpPubKeyHashFromPrivKey = (privKey: string | Buffer) => {
    if (privKey instanceof Buffer) {
      privKey = privKey.toString('hex')
    }
    if (Verify.isPrivate(privKey)) {
      const privK = new PrivateKey(privKey)
      return privK.privKey.pkh
    } else {
      throw new Error('Private key format error !')
    }
  }

  /**
   * @func Dump_publicKey_hash_from_address
   * @param [*addr]
   * @returns [publicKey]
   * @memberof Account
   */
  export const dumpPubKeyHashFromAddr = (addr: string) => {
    return Util.box2HexAddr(addr)
  }

  /**
   * @func Dump_privateKey_from_crypto.json
   * @param [*cryptoJSON]
   * @param [*pwd]
   * @returns [privKey]
   * @memberof Account
   */
  export const dumpPrivKeyFromCrypto = async (
    cryptoJSON: UtilInterface.Crypto,
    pwd: string
  ) => {
    // console.log('dumpPrivKeyFromCrypto param:', cryptoJSON, pwd)
    const cpt = cryptoJSON.crypto
    const kdfParams = cpt.kdfparams
    const saltBuffer = Buffer.from(kdfParams.salt, 'hex')
    const derivedKey = CryptoJson.getDerivedKey(
      pwd,
      saltBuffer,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dklen
    )
    const aesKey = derivedKey.slice(0, 16).toString('hex')
    const sha256Key = derivedKey.slice(16, 32).toString('hex')
    const mac = Aes.getMac(sha256Key, cpt.ciphertext)
    if (mac !== cpt.mac) {
      throw new Error('Wrong passphrase !')
    }
    const privateKeyHexStr = await Aes.getCiphertext(
      aesKey,
      cpt.ciphertext,
      cpt.cipherparams.iv
    )
    if (privateKeyHexStr) {
      return privateKeyHexStr
    } else {
      throw new Error('Private Key not found !')
    }
  }

  /**
   * @func Get_account_crypto_by_password
   * @param [*pwd]
   * @param [*privKey]
   * @returns [cryptoJson]
   * @memberof Account
   */
  export const getCryptoByPwd = (pwd: string, privKey?: string | Buffer) => {
    if (privKey) {
      if (privKey instanceof Buffer) {
        privKey = privKey.toString('hex')
      }
      if (!Verify.isPrivate(privKey)) {
        throw new Error('Private key format error !')
      }
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

export default Account
