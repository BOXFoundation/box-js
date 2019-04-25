import bs58 from 'bs58'
import { opcode } from '../../util/core'
import { putUint32 } from '../../util/util'

const { OP_ENCODE } = opcode
const op_hash_len = 32

/**
 * @func getUint32
 * @param [*buf] Buffer
 */
const getUint32 = (buf: Buffer) => {
  return buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24)
}

/**
 * @export hash+index=>token_address
 * @param [*opHash] string
 * @param [*index] string
 * @returns [token_address] string
 */
export const encodeTokenAddr = (opHash: string, index: string): string => {
  const before = Buffer.from(opHash, OP_ENCODE)
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
  const opHash = token_addr_buf.slice(0, op_hash_len).toString(OP_ENCODE)
  const index = getUint32(token_addr_buf.slice(op_hash_len + 1))
  return {
    opHash,
    index
  }
}
