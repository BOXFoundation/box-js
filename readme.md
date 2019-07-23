# boxd-js

![contentbox](https://contentbox.one/img/logo-top.png)

A Javascript implementation of BOX Payout blockchain on NodeJS or Browser.

## Npm

The official distribution package can be found at [npm](https://www.npmjs.com/package/boxdjs).

## Install

### Npm

```
npm i boxdjs
```

### CDN

```
<script src="https://todo"></script>
```

## Setup

### Build (nodejs & browser)

```
npm run build
```

### Test (Jest)

```
npm run test
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
