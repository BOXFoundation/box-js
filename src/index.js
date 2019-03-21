// import 'babel-polyfill';
import Jsonrpc from './jsonrpc';
import Wallet from './wallet';
import hash from './crypto/hash';
import bs58 from 'bs58';
import {
  encodeTokenAddrBuf,
  decodeTokenAddrBuf
} from './script/index';

var encode = encodeTokenAddrBuf('4647b36b556bea74e9436f96e089b7deb2bb93e6241b24f016862c862ad70d4d', '0')
console.log('bs58:', bs58.encode(encode))

export {
  Jsonrpc,
  Wallet,
  hash,
  bs58,
  encodeTokenAddrBuf,
  decodeTokenAddrBuf
};
