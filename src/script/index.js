const opcode = require('../config/opcode');
const _ = require('lodash');
const { calcTxHash } = require('./protobuf');
const { hash256 } = require('../crypto/hash');

const OPPUSHDATA1 = opcode.OPPUSHDATA1.toString(16);
const OPPUSHDATA2 = opcode.OPPUSHDATA2.toString(16);
const OPPUSHDATA4 = opcode.OPPUSHDATA4.toString(16);

const getNunberByte = num => num & 255;

/**
 * putUint16
 *
 * @param {*} [bytes=[]]
 * @param {*} uint16
 * @returns
 */
const putUint16 = (bytes = [], uint16) => {
  if (bytes.length < 2) {
    return new Error('The length of the bytes should more than 2!');
  }
  bytes[0] = getNunberByte(uint16);
  bytes[1] = uint16 >> 8;
  return bytes;
};

/**
 * putUint32
 *
 * @param {*} [bytes=[]]
 * @param {*} uint16
 * @returns
 */
const putUint32 = (bytes = [], uint16) => {
  if (bytes.length < 4) {
    return new Error('The length of the bytes should more than 4!');
  }
  bytes[0] = getNunberByte(uint16);
  bytes[1] = uint16 >> 8;
  bytes[2] = uint16 >> 16;
  bytes[3] = uint16 >> 24;
  return bytes;
};

/**
 *
 *
 * @param {string} [str=''] hex string
 * @param {string} [operand=''] hex string
 * @returns
 */
function addOperand(str = '', operand = '') {
  const dataLen = operand.length;

  if (dataLen < opcode.OPPUSHDATA1) {
    str += getNunberByte(dataLen);
  } else if (dataLen <= 0xff) {
    str = str + getNunberByte(OPPUSHDATA1) + getNunberByte(dataLen);
  } else if (dataLen <= 0xffff) {
    let buf = Buffer.alloc(2);
    buf = putUint16(buf, dataLen);
    str += OPPUSHDATA2;
    str += buf.toString('hex');
  } else {
    let buf = Buffer.alloc(4);
    buf = putUint16(buf, dataLen);
    str += OPPUSHDATA4;
    str += buf.toString('hex');
  }

  // Append the actual operand
  str += operand;
  return str;
}

const calcTxHashForSig = async (scriptPubKey, originalTx, txInIdx) => {
  if (txInIdx >= originalTx.Vin.length) {
    return '';
  }

  // Make a hard copy here to avoid racing conditions when verifying signature in parallel
  const tx = _.cloneDeep(originalTx);

  for (let i = 0; i < tx.Vin.length; i++) {
    const txIn = tx.Vin[i];
    if (i != txInIdx) {
      // Blank out other inputs' signatures
      txIn.ScriptSig = '';
    } else {
      // Replace scriptSig with referenced scriptPubKey
      txIn.ScriptSig = scriptPubKey;
    }
  }
  const protobuf = await calcTxHash(tx);
  const hashBuf = hash256(protobuf).reverse().toString('hex');
  return hashBuf;
};

/**
 * payToPubKeyHashScript
 *
 * @param {string} pkhAddrHex
 * @returns
 */
function payToPubKeyHashScript(pkhAddrHex) {
  const preHex = opcode.OPDUP.toString(16) + opcode.OPHASH160.toString(16);
  const midHex = addOperand(preHex, pkhAddrHex);
  const fullHex =
    preHex +
    midHex +
    opcode.OPEQUALVERIFY.toString(16) +
    opcode.OPCHECKSIG.toString(16);

  return fullHex;
}

/**
 * signatureScript
 *
 * @param {string} sig hex string
 * @param {string} pubKey hex string
 * @returns
 */
const signatureScript = (sig, pubKey) => {
  return addOperand('', sig) + pubKey;
};

module.exports = {
  payToPubKeyHashScript,
  calcTxHashForSig,
  signatureScript,
  putUint16,
  putUint32,
  addOperand
};
