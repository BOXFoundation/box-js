# boxd-js

A javascript API for integration with Boxd-based blockchain using [Boxd RPC API](https://github.com/BOXFoundation/boxd) on nodejs or browser.

Documentation can be found [here]().

![contentbox](https://contentbox.one/img/home-background.png)

## Installation

### NPM

The official distribution package can be found at [npm](https://www.npmjs.com/package/boxdjs).

### Add dependency to your project

```
npm i boxdjs
```

### Browser Distribution

Clone this repository locally then run `npm run build:node`. The browser distribution will be located in `dist` and can be directly copied into your project repository. The `dist` folder contains minified bundles ready for production, along with source mapped versions of the library for debugging.

### CDN

```
<script src="https://todo"></script>
```

## Import

### ES Modules

Supported using TypeScript, [webpack](https://webpack.js.org/api/module-methods), or [Node.js with `--experimental-modules` flag](https://nodejs.org/api/esm.html)

```js
import boxdjs from 'boxdjs'
import { Account, AccountManager, Api, Feature, Contract, Util } from 'boxdjs'
```

### CommonJS

Importing using commonJS syntax is supported by Node.js out of the box.

```js
const boxdjs = require('boxdjs').default
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
├── package
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

# TODO
.
├── boxdjs-script
│   ├── bundle.js
│   └── bundle.js.map
├── coverage
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── lcov-report
│   │   ├── account
│   │   ├── base.css
│   │   ├── block-navigation.js
│   │   ├── core
│   │   ├── index.html
│   │   ├── prettify.css
│   │   ├── prettify.js
│   │   ├── sort-arrow-sprite.png
│   │   ├── sorter.js
│   │   └── util
│   └── lcov.info
├── dist
│   ├── boxd
│   │   ├── account
│   │   ├── core
│   │   └── util
│   ├── browser.js
│   └── index.js
├── gulpfile.js
├── package
│   ├── boxd
│   │   ├── account
│   │   ├── core
│   │   └── util
│   ├── browser.ts
│   └── index.ts
├── package-lock.json
├── package.json
├── readme.md
├── static
│   ├── json
│   │   ├── keystore.json
│   │   └── mock.json
│   └── protobuf
│       ├── block.proto
│       ├── common.proto
│       ├── control.proto
│       ├── faucet.proto
│       ├── log.proto
│       ├── receipt.proto
│       ├── transaction.proto
│       └── web.proto
├── test
│   ├── a.faucet.test.ts
│   ├── b.account.test.ts
│   ├── b.util.test.ts
│   ├── core.abi.test.ts
│   ├── core.block.test.ts
│   ├── core.contract.test.ts
│   ├── core.split.test.ts
│   ├── core.token.test.ts
│   ├── core.tx.test.ts
│   ├── z.contract-test.js
│   └── z.rpc-test.ts
├── tsconfig.json
└── types
    └── index.d.ts
```

## License

[MIT](./LICENSE)
