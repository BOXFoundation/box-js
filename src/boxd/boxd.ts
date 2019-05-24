import Account from './account/account'
import AccountManager from './account/account-manager'
import Api from './core/api'
import Feature from './core/feature'
import TokenUtil from '../boxd/core/token/util'

const boxd = {
  Account,
  AccountManager,
  Api,
  Feature,
  util: TokenUtil
}

export default boxd
