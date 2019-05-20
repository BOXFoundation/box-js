import Account from './account/account'
import AccountManager from './account/account-manager'
import Api from './core/api'
import Feature from './core/feature'
import CommonUtil from './util/util'

const boxd = {
  account: Account,
  account_manager: AccountManager,
  core: Api,
  feature: Feature,
  util: CommonUtil
}

export default boxd
