const Rpc = require('../src/jsonrpc').default;
const fetch = require('node-fetch');

const rpc = new Rpc({ endpoint: 'http://127.0.0.1:19190', fetch });

rpc
  .getBlockByHash(
    '4aa4c3aa5efcbe3c1205cc4a02eb5712ea79f6fd797d38a9cd13101d84f574d7'
  )
  .then(console.log)
  .catch(console.error);
