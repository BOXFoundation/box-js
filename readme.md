## Project Structure

```
BoxMask-js
  │
  ├── config  #
  ├── dist  #
  ├── src  #
  │   ├── config
  │   ├── crypto
  │   │     ├── aes.js #
  │   │     ├── ecpair.js  #
  │   │     ├── hash.js  #
  │   │     └── keystore.js #
  |   |
  │   ├── script
  │   │     ├── index.js #
  │   │     ├── protobuf.js  #
  │   │     ├── tx.pb.js  #
  │   │     ├── tx.proto  #
  │   │     ├── tx.proto.js  #
  │   │     └── tx.proto2.js #
  |   |
  │   ├── index.js
  │   ├── jsonrpc.js
  │   ├── privatekey.js
  │   ├── rpc-error.js
  │   ├── token.js
  │   ├── tx.js
  │   └── wallet.js
  │
  ├── test  #
  ├── types  #
  ├── component  #
  │    ├── data  #
  │    │    └── js
  │    │        ├── common.js #
  │    │        ├── fetch.js  #
  │    │        └── fitter.js #
  │    │
  │    ├── page #
  │    ├── app.jsx  #
  │    ├── index.html #
  │    └── index.jsx #
  │
  ├── .editorconfig # 代码风 ├── Dockerfile # r 配置
  ├── package.json #  └── README.md #
```
