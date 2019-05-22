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

## API

[web3.js 1.0.0](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html)

[box-js 1.0.0]()

```bash
boxd
  │
  ├── util
        ├── core

  ├── account # 账号
        ├── core
        ├── getNetworkId # Get network id [ign]
        ├── getBalances # Get the balance of the given addresses
        ├── getTokenbalances # Get the token balance by the given address, tokenHash and tokenIndex
        ├── fetchUtxos # Get UTXOs by the given address
        ├── fetchTokenUtxos # Get UTXOs by the given address, tokenHash and tokenIndex

  ├── contract
        ├── core
        ├── addNode # 将给定的 nodeId 添加到本地节点，本地节点将连接到给定节点
        ├── getBlockByHash # Get block info by the block hash
        ├── getBlockByHeight # Get block info by the block height
        ├── getBlockHashByHeight # Get block hash of the block by height
        ├── getBlockHeaderByHash # Get header info of a block by the block hash
        ├── getBlockHeaderByHeight # Get header info of a block by the block height
        ├── getNodeInfo # Get rpc node info
        ├── getBlockHeight # Get the height of the last block
        ├── viewBlockDetail # Get block info by the given block hash
        ├── makeUnsignedTx # Make unsigned common transaction on-chain
        ├── makeUnsignedSplitAddrTx # Make unsigned split address tx
        ├── makeUnsignedTokenIssueTx # Make unsigned token issue tx, if submited, this will issue a token
        ├── makeUnsignedTokenTransferTx # Make unsigned token transfer tx
        ├── createTransaction # Create unsigned transaction by UTXOs
        ├── signTransaction # Sign a unsigned transaction
        ├── sendTransaction # Send transaction to the chain, it will come into the memory pool
        ├── viewTxDetail # Get transaction info by the given transaction hash

        ├── createSplitAddr # 构建分账合约 (整个流程)
        ├── createTransaction # 创建交易 (先实现一种)
        ├── dumpAddrFromPrivKey # 由私钥拿到地址 ()
        ├── dumpPrivKeyFromKeyStore # 由 KS 拿到私钥 ()

  ├── subscribe
```

## Project Structure

```
.
├── .vscode  # vscode config
├── coverage  # test coverage
├── dist  # builded
│
├── src
│   └── boxd
│       ├── boxd.ts  # boxd output file
│       ├── account
│       │   ├── account-manager.ts  # accounts manager
│       │   └── account.ts  # account core
│       ├── contract  # todo
│       ├── core  # boxd:core
│       │   ├── api.ts  # core:api function
│       │   ├── feature.ts  # core:feature function
│       │   ├── block
│       │   │   ├── request.ts  # api request data structure
│       │   │   └── response.ts  # api response data structure
│       │   ├── split
│       │   │   ├── request.ts
│       │   │   └── response.ts
│       │   ├── token
│       │   │   ├── request.ts
│       │   │   ├── response.ts
│       │   │   └── util.ts  # token tools
│       │   └── tx
│       │       ├── request.ts
│       │       └── response.ts
│       └── util  # boxd tools
│           ├── crypto   # crypto tools
│           │   ├── aes.ts  # [crypto-js](https://www.npmjs.com/package/crypto-js) :aes
│           │   ├── ecpair.ts  # [bitcoin-lib](https://www.npmjs.com/package/bitcoinjs-lib) :ecpair
│           │   ├── hash.ts
│           │   ├── keystore.ts  # account keystore
│           │   └── privatekey.ts  # privatekey class
│           ├── fetch.ts  # fetch class
│           ├── interface.ts  # util data structure
│           ├── util.ts  # util output file
│           ├── var.ts  # variable
│           └── verify.ts  # format verify
│
├── test  # jest test
│   ├── account.test.ts
│   ├── core.block.test.ts
│   ├── core.split.test.ts
│   ├── core.token.test.ts
│   ├── core.tx.test.ts
│   └── json  # test data json
│       ├── data.json
│       └── keystore.json
│ 
├── types  # typescript declaration
│    └── index.d.ts
│
├── gulpfile.js  # [gulp](https://gulpjs.com/)
├── note.md
├── package.json  # npm package config
├── README.md
└── tsconfig.json  # typescript config

```

./integration_tests -scope=continue
