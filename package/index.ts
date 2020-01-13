/* eslint-disable @typescript-eslint/no-var-requires */
import Account from './boxd/account/account'
import AccountManager from './boxd/account/account-manager'
import Api from './boxd/core/api'
import Feature from './boxd/core/feature'
const Contract = require('./boxd/core/contract/')
import Grpc from './boxd/util/grpc'
import Util from './boxd/util/util'

export default {
  Account,
  AccountManager,
  Api,
  Feature,
  Contract,
  Grpc,
  Util
}
