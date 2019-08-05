import CryptoJson from '../util/crypto/crypto-json'
import Aes from '../util/crypto/aes'
import PrivateKey from '../util/crypto/privatekey'
import Verify from '../util/verify'
import UtilInterface from '../util/interface'
import Util from '../util/util'

namespace Account {
  /**
   * @func Dump_P2PKH_address_from_PrivateKey
   * @param [*privKey]
   * @returns [P2PKH_Address]
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
   * @func Dump_PublicKey_from_PrivateKey
   * @param [*privKey]
   * @returns [PublicKey]
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
   * @func Dump_Crypto_from_PrivateKey
   * @param [*privKey]
   * @param [*pwd]
   * @returns [CryptoJson]
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
   * @func Dump_PublicKey_Hash_from_PrivateKey
   * @param [*privKey]
   * @returns [PublicKey_hash]
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
   * @func Dump_PublicKey_Hash_from_Address
   * @param [*addr]
   * @returns [PublicKey]
   * @memberof Account
   */
  export const dumpPubKeyHashFromAddr = (addr: string) => {
    return Util.box2HexAddr(addr)
  }

  /**
   * @func Dump_PrivateKey_from_Crypto
   * @param [*cryptoJSON]
   * @param [*pwd]
   * @returns [PrivateKey]
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
    if (!privateKeyHexStr) {
      throw new Error('Privat Key not found !')
    }
    return privateKeyHexStr
  }

  /**
   * @func Get_account_Crypto_by_Password
   * @param [*pwd]
   * @param [*privKey]
   * @returns [Crypto]
   * @memberof Account
   */
  export const getCryptoByPwd = (pwd: string, privKey?: string | Buffer) => {
    if (privKey && privKey instanceof Buffer) {
      privKey = privKey.toString('hex')
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
