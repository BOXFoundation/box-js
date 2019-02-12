const protobuf = require('protobufjs');
const proto = require('./tx.proto2.js');

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

const decodeMsg = buf => {
  const message = TxMsg.decode(buf);
  return TxMsg.toObject(message, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true // includes virtual oneof fields set to the present field's name
  });
};

module.exports = { calcTxHash, decodeMsg };
