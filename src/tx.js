const { getSignHash, signatureScript } = require('./script/index');

const checkTx = (tx, r_rx) => {
  console.log(tx, r_rx);
  // TODO: should check tx info before sign.
};

const signTxWithAcc = (acc, tx, protoBufs) => {
  for (let idx = 0; idx < tx.vin.length; idx++) {
    const sigHashBuf = getSignHash(protoBufs[idx]);
    const signBuf = acc.signMsg(sigHashBuf);
    const scriptSig = signatureScript(signBuf, acc.toPublicKey().toBuffer());
    tx.vin[idx].script_sig = scriptSig.toString('base64');

    // console.log(`\n[vin:${idx}]sigHash  : `, sigHash);
    // console.log(`[vin:${idx}]sign     : `, signBuf.toString('hex'));
    // console.log(`[vin:${idx}]scriptSig: `, scriptSig.toString('hex'));
    // console.log(`[vin:${idx}]scriptSig222: `, scriptSig.toString('base64'));
    // console.log('\n');
  }
  return tx;
};

module.exports = { signTxWithAcc, checkTx };
