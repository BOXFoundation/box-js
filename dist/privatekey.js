"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.newPrivateKey = newPrivateKey;exports.getPublicAddress = void 0;var _bitcoreLib = _interopRequireDefault(require("bitcore-lib"));



var _hash = require("./crypto/hash");



var _bs = _interopRequireDefault(require("bs58"));var _require = require('./crypto/ecpair'),fromPrivateKey = _require.fromPrivateKey;

var prefix = {
  P2PKH: '1326',
  P2SH: '132b' };


function getAddress(_this, prefixHex) {
  return function () {
    var sha256Content = prefixHex + this.pkh;
    var checksum = (0, _hash.sha256)((0, _hash.sha256)(Buffer.from(sha256Content, 'hex'))).slice(
    0,
    4);

    var content = sha256Content.concat(checksum.toString('hex'));
    this.P2PKHAddress = _bs.default.encode(Buffer.from(content, 'hex'));
    return this.P2PKHAddress;
  }.bind(_this);
}

/**
   * @func creat_a_new_accont
   * @param [*privKey_Str]
   */
function newPrivateKey(privKey_Str) {
  // console.log('==> newPrivateKey')
  // console.log('privKey_Str_1 :', privKey_Str)
  privKey_Str = privKey_Str.padStart(64, '0');
  // console.log('privKey_Str_2 :', privKey_Str)
  var newPrivateKey = new _bitcoreLib.default.PrivateKey(privKey_Str);
  newPrivateKey.signMsg = function (sigHash) {
    var eccPrivateKey = fromPrivateKey(Buffer.from(privKey_Str, 'hex'));
    return eccPrivateKey.sign(sigHash).sig;
  };
  newPrivateKey.pkh = getPublicAddress(newPrivateKey);
  newPrivateKey.toP2PKHAddress = getAddress(newPrivateKey, prefix.P2PKH);
  newPrivateKey.toP2SHAddress = getAddress(newPrivateKey, prefix.P2SH);

  return newPrivateKey;
}

var getPublicAddress = function getPublicAddress(privateKey) {
  return (0, _hash.hash160)(privateKey.toPublicKey().toBuffer()).toString('hex');
};exports.getPublicAddress = getPublicAddress;