const Rpc = require('../src/jsonrpc').default;
const fetch = require('node-fetch');
const bitcore = require('bitcore-lib');

const rpc = new Rpc({ endpoint: 'http://127.0.0.1:19190', fetch });

const testAddr = '17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV';
const testAmount = 5000;

const txTest = async () => {
  const ts = new bitcore.Transaction();
  console.log('ts:', ts);
  const { utxos } = await rpc.fetchUtxos(testAddr, testAmount);
  console.log(
    'utxos:',
    utxos.length,
    JSON.stringify(utxos[utxos.length - 1], null, 2)
  );
  for (let index = 0; index < utxos.length; index++) {
    const change = utxos[index];
    const value = change.tx_out.value;
  }
};

txTest();
