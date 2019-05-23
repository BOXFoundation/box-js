import Account from './account/account'
import AccountManager from './account/account-manager'
import Api from './core/api'
import Feature from './core/feature'
import TokenUtil from '../boxd/core/token/util'

const boxd = {
  account: Account,
  account_manager: AccountManager,
  core: Api,
  feature: Feature,
  util: TokenUtil
}

export default boxd
