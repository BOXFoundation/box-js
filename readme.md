# boxd-js

A Javascript implementation of BOX Payout blockchain on NodeJS or Browser.

## NPM

The official distribution package can be found at [npm](https://www.npmjs.com/package/boxdjs).

## Setup

### NPM Instal

```
`npm i boxdjs`
```

### CDN Install

```
<script src="https://todo"></script>
```

## Build (nodejs & browser)

```
`npm run build`
```

## Test (jest)

```
`npm run test`
```

## Project Structure

```bash
.
├── .vscode  # vscode config
├── coverage  # 'jest' test coverage
├── dist  # builded for nodejs
├── dist-web  # builded for browser
│
├── src
│   └── boxd
│       ├── boxd.ts  # boxd output file
│       ├── account
│       │   ├── account-manager.ts  # accounts manager
│       │   └── account.ts  # account core
│       ├── contract  # TODO
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
├── test  # 'jest' test
│   ├── account.test.ts
│   ├── core.block.test.ts
│   ├── core.split.test.ts
│   ├── core.token.test.ts
│   ├── core.tx.test.ts
│   └── json  # test database
│       ├── data.json
│       └── keystore.json
│ 
├── types  # typescript declaration
│    └── index.d.ts
│
├── .babelrc  # [Babel](https://babeljs.io/)
├── .eslintrc.json  # [Eslint](https://eslint.org/)
├── gulpfile.js  # [Gulp](https://gulpjs.com/)
├── package.json  # npm package config
└── tsconfig.json  # [Typescript](https://www.typescriptlang.org/)

```

## Note

### protobuf

protoc --js_out=library=myproto_libs,binary:. block.proto common.proto control.proto faucet.proto log.proto receipt.proto transaction.proto web.proto

    Number 转 字节数组

// let buffer = new Buffer(size) /// size 为 number 类型所占字节数
// buffer.writeXLE(number) /// 小端顺序写入， X 为 Number 类型
// buffer.writeXBE(number) /// 小端顺序写入， X 为 Number 类型
// 比如：

let number = 3.1415926 // PI
let buffer = new Buffer(8) // double 类型占 8 字节
buffer.writeDoubleLE(number) // 小端顺序写入 number

    字节数组转 Number

// let buffer = new Buffer([...])
// let number = buffer.readXLE(0) // 小端顺序读取
// let number = buffer.readXBE(0) // 大端顺序读取
// 如:
let buffer = new Buffer([0, 0, 0, 1])
let number = buffer.readUInt32LE(0)
// 1677216
