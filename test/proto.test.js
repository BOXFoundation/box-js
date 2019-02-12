const { calcTxHash, decodeMsg } = require('../src/script/protobuf');
const { hash256 } = require('../src/crypto/hash');

const testTx = {
  tx: {
    "vin": [
      {
        "prev_out_point": {
          "hash": "CJN6S1uTfBejKm0WVoFHwE1eh7aefJD/tKyd3CB6J+Q=",
          "index": 0
        },
        "script_sig": "RjBEAiBVdkxaNams5NUNhCgeHcq1k9wtG7ck4pk/uQ5MTHa7GQIgEz+8DB9ZRXPlBj3UfmmtxztWWAsMjacy+gBeEJtTvyAhAnnL2P9ieAgsPd1XEt09fcaDJlr9WFrqwlA9OkhdMA5V",
        "sequence": 0
      }
    ],
    "vout": [
      {
        "value": 4294,
        "script_pub_key": "dqkUsqcHHH3pTFrF382HYjL5vOiyo06IrA=="
      },
      {
        "value": 6669,
        "script_pub_key": "dqkUH2PCmhj6OM1eG1PTqCXgqgXsNemIrA=="
      },
      {
        "value": 5824,
        "script_pub_key": "dqkUPdIhGjVxQThuJLE/OcXZxV3cHr2IrA=="
      },
      {
        "value": 5772,
        "script_pub_key": "dqkUiDVv9eUE0FUrVssVIMqFV1SCSuWIrA=="
      },
      {
        "value": 80158,
        "script_pub_key": "dqkUsqcHHH3pTFrF382HYjL5vOiyo06IrA=="
      }
    ],
    "version": 0,
    "data": null,
    "magic": 0,
    "lockTime": 0
  },
  hash: '28950fcc806c484542c8b6437c4c6db111d95352f12d20240d5fd0cb25af7a05'
};

// describe('Test protobuf', () => {
//   it(`They should be same:`, () => {
//     const hashValue = calcTxHash(testTx[0].tx);
//     hashValue.should.equal(testTx[0].hash);
//   });
// });
const text = async () => {
  const hashValue = await calcTxHash(testTx.tx);
  console.log('hashValue:', hashValue.toString('hex'));
  console.log(
    '\nhashValue1: ',
    hash256(hashValue)
      .reverse()
      .toString('hex')
  );
  console.log(
    'hashValue2: ',
    '1f63ab208e4df84bc62fd14bb0fb0b0d8358b16e47351344e5703a91c4bba218'
  );
  console.log('hashValue21: ', testTx.hash);
  console.log(
    'hashValue3: ',
    JSON.stringify(
      decodeMsg(
        Buffer.from(
          '128f010a220a2008937a4b5b937c17a32a6d16568147c04d5e87b69e7c90ffb4ac9ddc207a27e41269463044022055764c5a35a9ace4d50d84281e1dcab593dc2d1bb724e2993fb90e4c4c76bb190220133fbc0c1f594573e5063dd47e69adc73b56580b0c8da732fa005e109b53bf20210279cbd8ff6278082c3ddd5712dd3d7dc683265afd585aeac2503d3a485d300e551a1e08c621121976a914b2a7071c7de94c5ac5dfcd876232f9bce8b2a34e88ac1a1e088d34121976a9141f63c29a18fa38cd5e1b53d3a825e0aa05ec35e988ac1a1e08c02d121976a9143dd2211a357141386e24b13f39c5d9c55ddc1ebd88ac1a1e088c2d121976a91488356ff5e504d0552b56cb1520ca855754824ae588ac1a1f089ef204121976a914b2a7071c7de94c5ac5dfcd876232f9bce8b2a34e88ac',
          'hex'
        )
      ),
      null,
      2
    )
  );
};
text();

const a = {
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
    { value: '4294' },
    { value: '6669' },
    { value: '5824' },
    { value: '5772' },
    { value: '80158' }
  ],
  Magic: 0,
  LockTime: '0'
};
