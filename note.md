## tmp

task (Q2)
|
unit. 核心的公共方法
命名空间、文件结构
不同的环境 build
检测交易合法性
完善 test 脚本 (先做功能，后工具)

type
|
前端
后端 (node)

BoxdClient (对外)
BoxdDaemon (推送)
BoxdException (异常)

API
│
├── addNode #连接到节点 (前&后)
├── createSplitAddr #构建分账合约 (整个流程)
├── createTransaction #创建交易 (先实现一种)
├── dumpAddrFromPrivKey #由私钥拿到地址 ()
├── dumpPrivKeyFromKeyStore #由 KS 拿到私钥 ()

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
  │   ├── rpcerror.js
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
