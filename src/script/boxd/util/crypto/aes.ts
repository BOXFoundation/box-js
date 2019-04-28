const CryptoJS = require('crypto-js')
const padding = CryptoJS.pad.NoPadding
const mode = CryptoJS.mode.CTR

/**
 * encrypt data
 *
 * @param {string} text hex string
 * @param {string} skey hex string
 * @param {string} iv hex string
 */
export const encrypt = (skey: any, text: any, iv: any) => {
  var key = CryptoJS.enc.Hex.parse(skey)
  var _iv = CryptoJS.enc.Hex.parse(iv)

  return CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(text), key, {
    mode,
    iv: _iv,
    padding
  })
}

/**
 * get Ciphertext
 *
 * @param {string} text hex string
 * @param {string} skey hex string
 * @param {string} iv hex string
 */
export const getCiphertext = (skey: any, text: any, iv: any) =>
  encrypt(skey, text, iv).ciphertext.toString(CryptoJS.enc.Hex)

/**
 *
 *
 * @param {string} cipherText hex string
 * @param {string} key hex string
 * @returns
 */
export const getMac = (key: string, cipherText: string) => {
  return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(key + cipherText)).toString(
    CryptoJS.enc.Hex
  )
}
