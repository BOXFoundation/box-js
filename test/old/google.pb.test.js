const { Transaction } = require('../src/script/tx.pb');

const testTx = {
  tx: {
    Version: 0,
    Vin: [
      {
        PrevOutPoint: {
          Hash:
            'e4277a20dc9dacb4ff907c9eb6875e4dc0478156166d2aa3177c935b4b7a9308',
          Index: 0
        },
        ScriptSig:
          'RjBEAiBVdkxaNams5NUNhCgeHcq1k9wtG7ck4pk/uQ5MTHa7GQIgEz+8DB9ZRXPlBj3UfmmtxztWWAsMjacy+gBeEJtTvyAhAnnL2P9ieAgsPd1XEt09fcaDJlr9WFrqwlA9OkhdMA5V',
        Sequence: 0
      }
    ],
    Vout: [
      {
        value: 4294,
        script_pub_key: 'dqkUsqcHHH3pTFrF382HYjL5vOiyo06IrA=='
      },
      {
        value: 6669,
        script_pub_key: 'dqkUH2PCmhj6OM1eG1PTqCXgqgXsNemIrA=='
      },
      {
        value: 5824,
        script_pub_key: 'dqkUPdIhGjVxQThuJLE/OcXZxV3cHr2IrA=='
      },
      {
        value: 5772,
        script_pub_key: 'dqkUiDVv9eUE0FUrVssVIMqFV1SCSuWIrA=='
      },
      {
        value: 80158,
        script_pub_key: 'dqkUsqcHHH3pTFrF382HYjL5vOiyo06IrA=='
      }
    ],
    Data: null,
    Magic: 0,
    LockTime: 0
  },
  hash: '1f63ab208e4df84bc62fd14bb0fb0b0d8358b16e47351344e5703a91c4bba218'
};

const test = () => {
  const tx = testTx.tx;
  var message = new Transaction();
  console.log('tx.Vin:', tx.Vin);
  message.setVersion(tx.Version);
  message.setVinList(tx.Vin);
  // message.setVoutList(tx.Vout);
  message.setData(tx.Data);
  message.setMagic(tx.Magic);
  message.setLockTime(tx.LockTime);

  // Serializes to a UInt8Array.
  var bytes = message.serializeBinary();
  console.log('bytes:', bytes.length);
};

test();
