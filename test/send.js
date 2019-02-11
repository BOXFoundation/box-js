const Rpc = require('../src/jsonrpc').default;
const fetch = require('node-fetch');

const { unlockPrivateKeyWithPassphrase } = require('../src/crypto/keystore');
const { newPrivateKey } = require('../src/privatekey');
const { signTxWithAcc } = require('../src/tx');

const crypto = require('./data/crypto2.json');
const testPwd = '1';

const rpc = new Rpc({ endpoint: 'http://127.0.0.1:19190', fetch });

const txData = {

  version:0,
  tx: {
    vin: [
      {
        prevOutPoint: {
          hash: 'GOmAXMVWUr2m19sSS21AoyOTlJJD5EdBsBRTA4XqTpw='
        }
      },
      {
        prevOutPoint: {
          hash: 'NsvNHRa9XeM45Q8AgoCsLfpCkO6X/SlGY0yILPicYx8=',
          index: 1
        }
      },
      {
        prevOutPoint: {
          hash: '4Iw6ZdLQSvwn7GVZp1vUvSINkRa5rMU7aIYHm1z/pjw=',
          index: 2
        }
      }
    ],
    vout: [
      {
        value: 24000,
        scriptPubKey: 'dqkUrj6W0AhljbZN1PjfLXNu28a+HDGIrA=='
      },
      {
        value: 38000,
        scriptPubKey: 'dqkUBks3fJVVuDpD0Fx3PO98OmIJFU+IrA=='
      },
      {
        value: 8815,
        scriptPubKey: 'dqkUzoYFZ4bjQVUw+Mxzn7QUqHQ1tLaIrA=='
      }
    ]
  },
  sign_hash: [
    '123f0a220a2018e9805cc55652bda6d7db124b6d40a32393949243e44741b014530385ea4e9c121976a914ce86056786e3415530f8cc739fb414a87435b4b688ac12260a240a2036cbcd1d16bd5de338e50f008280ac2dfa4290ee97fd2946634c882cf89c631f100112260a240a20e08c3a65d2d04afc27ec6559a75bd4bd220d9116b9acc53b6886079b5cffa63c10021a1f08c0bb01121976a914ae3e96d008658db64dd4f8df2d736edbc6be1c3188ac1a1f08f0a802121976a914064b377c9555b83a43d05c773cef7c3a6209154f88ac1a1e08ef44121976a914ce86056786e3415530f8cc739fb414a87435b4b688ac',
    '12240a220a2018e9805cc55652bda6d7db124b6d40a32393949243e44741b014530385ea4e9c12410a240a2036cbcd1d16bd5de338e50f008280ac2dfa4290ee97fd2946634c882cf89c631f1001121976a914ce86056786e3415530f8cc739fb414a87435b4b688ac12260a240a20e08c3a65d2d04afc27ec6559a75bd4bd220d9116b9acc53b6886079b5cffa63c10021a1f08c0bb01121976a914ae3e96d008658db64dd4f8df2d736edbc6be1c3188ac1a1f08f0a802121976a914064b377c9555b83a43d05c773cef7c3a6209154f88ac1a1e08ef44121976a914ce86056786e3415530f8cc739fb414a87435b4b688ac',
    '12240a220a2018e9805cc55652bda6d7db124b6d40a32393949243e44741b014530385ea4e9c12260a240a2036cbcd1d16bd5de338e50f008280ac2dfa4290ee97fd2946634c882cf89c631f100112410a240a20e08c3a65d2d04afc27ec6559a75bd4bd220d9116b9acc53b6886079b5cffa63c1002121976a914ce86056786e3415530f8cc739fb414a87435b4b688ac1a1f08c0bb01121976a914ae3e96d008658db64dd4f8df2d736edbc6be1c3188ac1a1f08f0a802121976a914064b377c9555b83a43d05c773cef7c3a6209154f88ac1a1e08ef44121976a914ce86056786e3415530f8cc739fb414a87435b4b688ac'
  ]
};

const test = async () => {
  const key = await unlockPrivateKeyWithPassphrase(crypto, testPwd);
  const testAcc = newPrivateKey(key);
  const signedTx = signTxWithAcc(testAcc, txData.tx, txData.sign_hash);
  console.log('signedTx:\n', JSON.stringify(signedTx, null, 2));
  rpc.sendTransaction(signedTx).then(r=>{
    console.log(r);
  }).catch(e=>{
    console.error('error:', e)
  })
};
test();
