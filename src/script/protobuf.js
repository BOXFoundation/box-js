const protobuf = require('protobufjs');
const proto = require('./tx.proto.js');

var root = protobuf.Root.fromJSON(proto);
const TxMsg = root.lookupType('txpackage.Transaction');

function calcTxHash(tx) {
  console.log('tx:', JSON.stringify(tx));
  if (!tx) {
    return new Error('Transaction is required!');
  }
  const errMsg = TxMsg.verify(tx);
  if (errMsg) {
    console.error('error:', errMsg);
    throw Error(errMsg);
  }
  // Create a new message

  const message = TxMsg.create(tx); // or use .fromObject if conversion is necessary
  // console.log('message:', message);
  const buffer = TxMsg.encode(message).finish();
  const message2 = TxMsg.decode(buffer);

  console.log('message:', JSON.stringify(message));
  console.log('message2:', message2);

  return buffer;
}

module.exports = { calcTxHash };
