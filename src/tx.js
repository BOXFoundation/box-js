const opcode = require('./config/opcode');
const {
  addOperand,
  getSignHash,
  calcTxHashForSig,
  payToPubKeyHashScript,
  signatureScript
} = require('./script/index');

const baseTx = {
  Version: 0,
  Vin: [],
  Vout: [],
  Data: null,
  Magic: 0,
  LockTime: 0
};

async function newTx(fromAcc, toAddrs = [], amounts = [], utxos = []) {
  let amount = 0;
  amounts.forEach(a => {
    amount += a;
  });
  let fee;
  if (amount >= 10000) {
    fee = amount / 10000;
  }
  const signTx = await newTxWithFee(fromAcc, toAddrs, amounts, utxos, fee);
  return signTx;
}

async function newTxWithFee(fromAcc, toAddrs, amounts, utxos, fee) {
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
  const signTx = await newTxWithUtxos(
    fromAcc,
    utxos,
    toAddrs,
    amounts,
    changeAmt,
    total,
    amount
  );

  return signTx;
}

async function newTxWithUtxos(
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
    vouts.push(makeVout(toAddr, amounts[i]));
  });
  console.log('fromAcc:', fromAcc.toP2PKHAddress());
  // vout for change of fromAddress
  const fromAddrOut = makeVout(fromAcc.toP2PKHAddress(), changeAmt);
  vouts.push(fromAddrOut);
  const tx = { ...baseTx };
  tx.Vin = vins;
  tx.Vout = vouts;

  const signTx = await signTxWithUtxos(tx, utxos, fromAcc);
  return signTx;
}

function makeVin(utxo, seq) {
  try {
    return {
      PrevOutPoint: {
        Hash: utxo.out_point.hash,
        Index: utxo.out_point.index
      },
      ScriptSig: '',
      Sequence: seq
    };
  } catch (error) {
    console.log('utxo:', utxo);
    throw error;
  }
}

function makeVout(pkhAddrHex, amount) {
  const addrScript = payToPubKeyHashScript(pkhAddrHex);
  return { Value: amount, ScriptPubKey: addrScript };
}

async function signTxWithUtxos(tx, utxos, acc) {
  for (let i = 0; i < utxos.length; i++) {
    const utxo = utxos[i];
    const scriptPkBytes = utxo.tx_out.script_pub_key;
    const sigHash = await calcTxHashForSig(scriptPkBytes, tx, i);
    const sig = acc.signMsg(sigHash);
    const scriptSig = signatureScript(sig, acc.pkh);
    tx.Vin[i].ScriptSig = scriptSig;

    console.log('sigHash:  ', sigHash);
    console.log('sig:      ', sig);
    console.log('scriptSig:', scriptSig);
  }

  return tx;
}

const signTxWithAcc = (acc, tx, protoBufs) => {
  for (let idx = 0; idx < tx.vin.length; idx++) {
    const sigHash = getSignHash(protoBufs[idx]);
    const sign = acc.signMsg(sigHash);
    const scriptSig = signatureScript(sign, acc.pkh);
    tx.vin[idx].ScriptSig = scriptSig;

    console.log(`[vin:${idx}]: `, sigHash);
    console.log(`[vin:${idx}]: `, sign);
    console.log(`[vin:${idx}]: `, scriptSig);
  }
  return tx;
};

module.exports = { newTx, signTxWithAcc };
