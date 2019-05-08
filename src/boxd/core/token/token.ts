import bs58 from 'bs58'
import { putUint32 } from '../../util/util'
import {
  TokenBalance,
  TokenBalances,
  TokenIssueTx,
  TokenTransferTx
} from '../request'

const op_hash_len = 32

/**
 * @func getUint32
 * @param [*buf] Buffer
 */
const getUint32 = (buf: Buffer) => {
  return buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24)
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
 * @export make-Unsigned-Token-Issue-Tx
 * @param [*token_issue_tx] TokenIssueTx
 * @returns [response]
 */
export const makeUnsignedTokenIssueTx = (
  _fetch: any,
  token_issue_tx: TokenIssueTx
) => {
  return _fetch('/tx/makeunsignedtx/token/issue', token_issue_tx)
}

/**
 * @export make-Unsigned-Token-Transfer-Tx
 * @param [*token_transfer_tx] TokenTransferTx
 * @returns [response]
 */
export const makeUnsignedTokenTransferTx = (
  _fetch: any,
  token_transfer_tx: TokenTransferTx
) => {
  return _fetch('/tx/makeunsignedtx/token/transfer', token_transfer_tx)
}

/**
 * @export hash+index=>token_address
 * @param [*opHash] string
 * @param [*index] number
 * @returns [token_address] string
 */
export const encodeTokenAddr = (opHash: string, index: number): string => {
  const before = Buffer.from(opHash, 'hex')
  const end = putUint32(Buffer.alloc(4), Number(index))
  return bs58.encode(Buffer.concat([before, Buffer.from(':'), end]))
}

/**
 * @func token_address=>hash+index
 * @param [*token_address] string
 * @returns [{hash,index}] object
 */
export const decodeTokenAddr = (token_address: string): any => {
  const token_addr_buf = bs58.decode(token_address)
  const opHash = token_addr_buf.slice(0, op_hash_len).toString('hex')
  const index = getUint32(token_addr_buf.slice(op_hash_len + 1))
  return {
    opHash,
    index
  }
}
