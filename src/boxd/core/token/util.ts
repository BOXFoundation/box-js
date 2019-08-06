import bs58 from 'bs58'
import CommonUtil from '../../util/util'

const op_hash_len = 32
/**
 * @func Get_Uint32
 * @param [*buf]
 */
const getUint32 = (buf: Buffer) => {
  return buf[0] | (buf[1] << 8) | (buf[2] << 16) | (buf[3] << 24)
}

namespace Util {
  /**
   * @export hash+index=>token_address
   * @param [*opHash] token hash
   * @param [*index] token index
   * @returns [token_address]
   */
  export const encodeTokenAddr = (token_addr: {
  opHash: string;
  index: number;
  }): string => {
    const { opHash, index } = token_addr
    const before = Buffer.from(opHash, 'hex')
    const end = CommonUtil.putUint32(Buffer.alloc(4), Number(index))
    return bs58.encode(Buffer.concat([before, Buffer.from(':'), end]))
  }

  /**
   * @func token_address=>hash+index
   * @param [*token_address]
   * @returns [{hash,index}]
   */
  export const decodeTokenAddr = (token_address: string) => {
    const token_addr_buf = bs58.decode(token_address)
    const opHash = token_addr_buf.slice(0, op_hash_len).toString('hex')
    const index = getUint32(token_addr_buf.slice(op_hash_len + 1))
    return {
      opHash,
      index
    }
  }
}

export default Util
