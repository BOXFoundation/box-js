/* eslint-disable @typescript-eslint/member-delimiter-style */
import scrypt from 'scrypt.js'
import randomBytes from 'randombytes'
import Aes from './aes'
import UtilInterface from '../interface'

const _STRING_ENC_ = 'hex'
// The AES block size in bytes. see go/1.11.2/libexec/src/crypto/aes/cipher.go
const aesBlockSize = 16
const scryptOpt = {
  n: 1 << 18,
  r: 8,
  p: 1,
  dklen: 32
}

namespace CryptoJson {
  /**
   * @export get-DerivedKey-by-Passphrase
   * @param [passphrase] string
   * @param [salt] Buffer
   * @param [n] number
   * @param [r] number
   * @param [p] number
   * @param [dklen] number
   * @returns Buffer
   */
  export const getDerivedKey = (
    passphrase: string,
    salt: Buffer,
    n: number,
    r: number,
    p: number,
    dklen: number
  ) => {
    return scrypt(Buffer.from(passphrase), salt, n, r, p, dklen)
    // delete progress
  }

  /**
   * @export get-Crypto-by-PrivateKey&Passphrase
   * @param [privateKey] privateKey
   * @param [passphrase] string
   * @returns [CryptoJson] CryptoJson
   */
  export const getCryptoByPrivKey = (
    privateKey: {
      toString: (arg0: string) => void
      toP2PKHAddress
    },
    passphrase: string
  ): UtilInterface.Crypto => {
    if (!privateKey) {
      throw new Error('PrivateKey is require!')
    }

    if (!passphrase) {
      throw new Error('Passphrase is require!')
    }

    try {
      const privateKeyHexStr = privateKey.toString(_STRING_ENC_)
      const address = privateKey.toP2PKHAddress

      const salt = randomBytes(32)
      const iv = randomBytes(aesBlockSize).toString(_STRING_ENC_)
      const derivedKey = getDerivedKey(
        passphrase,
        salt,
        scryptOpt.n,
        scryptOpt.r,
        scryptOpt.p,
        scryptOpt.dklen
      )

      const aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_)
      const sha256Key = derivedKey.slice(16).toString(_STRING_ENC_)
      const cipherText = Aes.getCiphertext(aesKey, privateKeyHexStr, iv)
      const mac = Aes.getMac(sha256Key, cipherText)

      return {
        id: '',
        address,
        crypto: {
          cipher: 'aes-128-ctr',
          ciphertext: cipherText,
          cipherparams: {
            iv
          },
          mac,
          kdfparams: {
            salt: salt.toString(_STRING_ENC_),
            ...scryptOpt
          }
        }
      }
    } catch (err) {
      err.message += '[Err:getCryptoJSON]'
      throw new Error(err)
    }
  }

  /**
   * @export unlock-PrivateKey-by-Passphrase
   * @param [ksJSON] object
   * @param [passphrase] string
   * @returns [privateKeyHexStr]
   */
  /*   export const unlockPrivateKeyWithPassphrase = (
    ksJSON: { crypto },
    passphrase: string
  ) => {
    if (!passphrase) {
      throw new Error('Passphrase is require!')
    }
    if (!ksJSON) {
      throw new Error('ksJSON is require!')
    }
    const cpt = ksJSON.crypto
    const kdfParams = cpt.kdfparams
    const saltBuffer = Buffer.from(kdfParams.salt, _STRING_ENC_)
    const derivedKey = getDerivedKey(
      passphrase,
      saltBuffer,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dklen
    )

    const aesKey = derivedKey.slice(0, 16).toString(_STRING_ENC_)
    const sha256Key = derivedKey.slice(16, 32).toString(_STRING_ENC_)
    const mac = Aes.getMac(sha256Key, cpt.ciphertext)
    if (mac !== cpt.mac) {
      throw new Error('passphrase is error!')
    }
    const privateKeyHexStr = Aes.getCiphertext(
      aesKey,
      cpt.ciphertext,
      cpt.cipherparams.iv
    )
    if (!privateKeyHexStr) {
      throw new Error("Can't find privateKey!")
    }
    return privateKeyHexStr
  } */
}

export default CryptoJson
