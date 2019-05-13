import bs58 from 'bs58'
import { putUint32 } from '../../util/util'
import {
  TokenBalance,
  TokenBalances,
  TokenIssueTx,
  TokenTransferTx
} from '../request'

/**
 * @export make-Unsigned-Token-Issue-Tx
 * @param [*token_issue_tx] TokenIssueTx
 * @returns [promise]
 */
export const makeUnsignedTokenIssueTx = (
  _fetch: any,
  token_issue_tx: TokenIssueTx
) => {
  return _fetch('/tx/makeunsignedtx/token/issue', token_issue_tx)
}

/**
 * @export get-Token-Balance
 * @param [*token] token
 * @returns [balances] string
 */
export const getTokenbalance = (_fetch: any, token: TokenBalance): string => {
  return _fetch('/tx/gettokenbalance', token)
}

/**
 * @export get-Token-Balance-Array
 * @param [*tokens] tokens
 * @returns [balances] string
 */
export const getTokenbalances = (
  _fetch: any,
  tokens: TokenBalances
): string => {
  return _fetch('/tx/gettokenbalance', tokens)
}

/**
 * @export make-Unsigned-Token-Transfer-Tx
 * @param [*token_transfer_tx] TokenTransferTx
 * @returns [promise]
 */
export const makeUnsignedTokenTransferTx = (
  _fetch: any,
  token_transfer_tx: TokenTransferTx
) => {
  return _fetch('/tx/makeunsignedtx/token/transfer', token_transfer_tx)
}
