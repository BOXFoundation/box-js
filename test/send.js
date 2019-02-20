const Rpc = require('../src/jsonrpc').default;
const fetch = require('node-fetch');

const { unlockPrivateKeyWithPassphrase } = require('../src/crypto/keystore');
const { newPrivateKey } = require('../src/privatekey');
const { signTxWithAcc } = require('../src/tx');

const crypto = require('./data/key1.json');
const testPwd = '1';

const rpc = new Rpc({ endpoint: 'http://127.0.0.1:19190', fetch });

const txData = {
  tx: {
    vin: [
      {
        prev_out_point: {
          hash: 'ySOMoSmGKXkqznHUXZNzB/GLnsVdHCZ6+taly9yafb8='
        }
      }
    ],
    vout: [
      {
        value: 161057,
        script_pub_key: 'dqkUMfTYEqmjNBTjcaPNy8a0U/4Kn3mIrA=='
      },
      {
        value: 148712,
        script_pub_key: 'dqkUTwz/hpz06vu6tvE0lLrdUmhFKXiIrA=='
      },
      {
        value: 134377,
        script_pub_key: 'dqkUztR9LIrodEiYtzRrZw0IAf7CbtKIrA=='
      },
      {
        value: 88709,
        script_pub_key: 'dqkU1hAmdeukIK5RIKTDjQnjU+Rdrj6IrA=='
      }
    ]
  },
  rawMsgs: [
    'EkEKJAogRjUVNC7cniLF7ghJ+0lA9uDzhRFr9ffiTic/CBdalasQAhIZdqkUzoYFZ4bjQVUw+Mxzn7QUqHQ1tLaIrBodCGQSGXapFDH02BKpozQU43GjzcvGtFP+Cp95iKwaHgjIARIZdqkUTwz/hpz06vu6tvE0lLrdUmhFKXiIrBoeCKwCEhl2qRTO1H0siuh0SJi3NGtnDQgB/sJu0oisGh4IkAMSGXapFNYQJnXrpCCuUSCkw40J41PkXa4+iKwaIQj9xYDLEhIZdqkUzoYFZ4bjQVUw+Mxzn7QUqHQ1tLaIrA=='
  ]
};

const testSend = async () => {
  const key = await unlockPrivateKeyWithPassphrase(crypto, testPwd);
  const testAcc = newPrivateKey(key);
  const addr = testAcc.pkh;
  // const signedTx = signTxWithAcc(testAcc, txData.tx, txData.rawMsgs);
  // console.log('signedTx:\n', JSON.stringify(signedTx, null, 2));

  rpc
    .sendTransaction(testAcc, addr, [addr], [1])
    .then(r => {
      console.log('r:', r);
    })
    .catch(e => {
      console.error('error:', e);
    });
};

const sigHash =
  'd10a03bb24cdd66ce340f908bb63a271b4b1c6da80a16c67e3d15a538d1a97cc';
const sigHash2 =
  'cc971a8d535ad1e3676ca180dac6b1b471a263bb08f940e36cd6cd24bb030ad1';
const sig =
  '3045022100bd1c819b40dadd402e6b69e7fc45e4176c47a9a9c3f503691920d6ca4c13dbb6022050a60e61386abfe03ceaeada196dbdeebdd62e322c1092059025137bfc9baef0';
const sig2 =
  '3045022100bd1c819b40dadd402e6b69e7fc45e4176c47a9a9c3f503691920d6ca4c13dbb6022050a60e61386abfe03ceaeada196dbdeebdd62e322c1092059025137bfc9baef0';

const scriptSig =
  '473045022100bd1c819b40dadd402e6b69e7fc45e4176c47a9a9c3f503691920d6ca4c13dbb6022050a60e61386abfe03ceaeada196dbdeebdd62e322c1092059025137bfc9baef021037ffccc3f2ab0aa4690f507d105552ae4e338406615cadc7d7d98abd713fd710a';

const scriptSig1 =
  '473045022100bd1c819b40dadd402e6b69e7fc45e4176c47a9a9c3f503691920d6ca4c13dbb6022050a60e61386abfe03ceaeada196dbdeebdd62e322c1092059025137bfc9baef0';

const scriptSig2 =
  '473045022100bd1c819b40dadd402e6b69e7fc45e4176c47a9a9c3f503691920d6ca4c13dbb6022050a60e61386abfe03ceaeada196dbdeebdd62e322c1092059025137bfc9baef021037ffccc3f2ab0aa4690f507d105552ae4e338406615cadc7d7d98abd713fd710a';

const testSign = async () => {
  const key = await unlockPrivateKeyWithPassphrase(crypto, testPwd);
  const testAcc = newPrivateKey(key);
  const addr = testAcc.pkh;
  const signedTx = signTxWithAcc(testAcc, txData.tx, txData.rawMsgs);
};

testSend(r => {
  console.log('r:', r);
}).catch(console.error);
