# boxd-js ![](https://img.shields.io/github/issues/BOXFoundation/box-js) ![](https://travis-ci.com/BOXFoundation/boxd.svg?branch=master)

By **[Contentbox](https://contentbox.one/)**

A javascript API for integration with boxd-based blockchain using [Boxd RPC API](https://github.com/BOXFoundation/boxd) on nodejs or browser.

Documentation can be found [here](https://github.com/BOXFoundation/box-js/wiki).

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
├── boxdjs-script # packages used in the <script>
├── dist
│   ├── boxd
│   ├── browser.js # packages used in the browser
│   └── index.js # packages used in the nodejs
├── package # source
│   ├── boxd # package name
│   │   ├── account
│   │   │   ├── account-manager.ts # mature account system
│   │   │   └── account.ts # account API
│   │   ├── core
│   │   │   ├── token # token API
│   │   │   ├── block # block & node API
│   │   │   ├── contract # contract API
│   │   │   ├── tx # BOX transaction API
│   │   │   ├── split # split contract API
│   │   │   ├── api.ts # API export
│   │   │   └── feature.ts # encapsulated API export
│   │   └── util # utility functions
│   ├── browser.ts # package export for browser
│   └── index.ts # package export for nodejs
├── static
│   ├── json
│   │   ├── keystore.json # local key-store for test
│   │   └── mock.json # local mock data for test
│   └── protobuf
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
├── .babelrc  # [Babel](https://babeljs.io/)
├── .prettierrc  # [Prettier](https://prettier.io/)
├── .eslintrc.json  # [Eslint](https://eslint.org/)
├── .gitignore
├── tsconfig.json # [Typescript](https://www.typescriptlang.org/)
├── gulpfile.js # [Gulp](https://gulpjs.com/)
├── package-lock.json
├── package.json
├── LICENSE
├── README.md
└── types
    └── index.d.ts # typescript declaration
```

## License

[MIT](./LICENSE)
