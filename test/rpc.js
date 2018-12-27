const Rpc = require('../src/jsonrpc').default;
const fetch = require('node-fetch');

const rpc = new Rpc({ endpoint: 'http://127.0.0.1:19190', fetch });

rpc.getBalance('6133ae4a8858550282767a6eca7bb74baefea38c').then(console.log).catch(console.error)
