const Rpc = require('../src/jsonrpc').default;
const fetch = require('node-fetch');

const rpc = new Rpc({ endpoint: 'http://127.0.0.1:19190', fetch });

rpc
  .getBalance(['b1cfm7kVEtHg1f3McjYdkriT2DBu5dG2Kog'])
  .then(console.log)
  .catch(console.error);
