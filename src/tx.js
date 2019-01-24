const bitcore = require('bitcore-lib');
const opcode = require('./config/opcode');

function newTx(fromAcc, toAddrs = [], amounts = [], utxos = []) {
  let amount = 0;
  amounts.forEach(a => {
    amount += a;
  });
  let fee;
  if (amount >= 10000) {
    fee = amount / 10000;
  }
  newTxWithFee(fromAcc, toAddrs, amounts, utxos, fee);
}

function newTxWithFee(fromAcc, toAddrs, amounts, utxos, fee) {
  let amount = 0,
    total = 0;

  amounts.forEach(a => {
    amount += a;
  });
  utxos.forEach(u => {
    total += Number(u.tx_out.value);
  });
  const changeAmt = total - amount - fee;
  if (changeAmt >= total) {
    return new Error(
      'invalid arguments, utxo total=%d, amount=%d, fee=%d, ' + 'changeAmt=%d',
      total,
      amount,
      fee,
      changeAmt
    );
  }
  const { tx, change, err } = newTxWithUtxos(
    fromAcc,
    utxos,
    toAddrs,
    amounts,
    changeAmt,
    total,
    amount
  );
}

function newTxWithUtxos(
  fromAcc,
  utxos,
  toAddrs,
  amounts,
  changeAmt,
  utxoValue,
  amount
) {
  if (utxoValue < amount + changeAmt) {
    return new Error(
      'input %d is less than output %d',
      utxoValue,
      amount + changeAmt
    );
  }
  const vins = [];
  const vouts = [];

  utxos.forEach(utxo => {
    vins.push(makeVin(utxo, 0));
  });
  toAddrs.forEach((toAddr, i) => {
    vins.push(makeVout(toAddr, amounts[i]));
  });
  console.log('fromAcc:', fromAcc.toP2PKHAddress());
  // vout for change of fromAddress
  const fromAddrOut = makeVout(fromAcc.toP2PKHAddress(), changeAmt);
  vins.push(fromAddrOut);
  const tx = {};

  const data = signTxWithUtxos(tx, utxos, fromAcc);
}

function makeVin(ts, utxo, seq) {
  return {
    PrevOutPoint: {
      Hash: utxo.out_point.hash,
      Index: utxo.out_point.index
    },
    ScriptSig: '',
    Sequence: seq
  };
}

function makeVout(addr, amount) {
  const addrScript = getAddrScript(addr);
  return { Value: amount, ScriptPubKey: addrScript };
}

function getAddrScript(addr) {
  return (
    opcode.OPDUP +
    opcode.OPHASH160 +
    addr +
    opcode.OPEQUALVERIFY +
    opcode.OPCHECKSIG
  );
}

function signTxWithUtxos() {}

module.exports = { newTx };
