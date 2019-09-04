import CryptoJS from 'crypto-js'
const padding = CryptoJS.pad.NoPadding
const mode = CryptoJS.mode.CTR

namespace Aes {
  /**
   * @export Encrypt-data
   * @param [*skey] string
   * @param [*text] string
   * @param [*iv] string
   */
  export const encrypt = (skey, text, iv) => {
    var key = CryptoJS.enc.Hex.parse(skey)
    var _iv = CryptoJS.enc.Hex.parse(iv)

    return CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(text), key, {
      mode,
      iv: _iv,
      padding
    })
  }

  /**
   * @export get-Ciphertext
   * @param [*skey] string
   * @param [*text] string
   * @param [*iv] string
   */
  export const getCiphertext = (skey, text, iv) =>
    encrypt(skey, text, iv).ciphertext.toString(CryptoJS.enc.Hex)

  /**
   * @export get-Mac
   * @param [key] string
   * @param [cipherText] string
   */
  export const getMac = (key: string, cipherText: string) => {
    return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(key + cipherText)).toString(
      CryptoJS.enc.Hex
    )
  }
}

export default Aes
