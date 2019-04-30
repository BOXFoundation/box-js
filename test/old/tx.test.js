const Rpc = require('../src/jsonrpc').default;
const fetch = require('node-fetch');
const bitcore = require('bitcore-lib');
const { newTx } = require('../src/tx');
const { newPrivateKey } = require('../src/privatekey');

const rpc = new Rpc({ endpoint: 'http://127.0.0.1:19190', fetch });

const testPrivateKey =
  '1253763c15ab327823c15dface658c7f269512987d750cb50d4d84094c63da6c';
const testPass = '123';
const testAddr = 'b1cfm7kVEtHg1f3McjYdkriT2DBu5dG2Kog';
const testAmount = 5000;

const acc = newPrivateKey(testPrivateKey);

const txTest = async () => {
  const { utxos = [] } = await rpc.fetchUtxos(testAddr, testAmount);
  console.log(
    'utxos:',
    utxos.length,
    JSON.stringify(utxos[utxos.length - 1], null, 2)
  );

  const tx = await newTx(
    acc,
    ['17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV'],
    [10000],
    utxos.slice(0, 3)
  );

  console.log(JSON.stringify(tx));
};

txTest().catch(console.error);
