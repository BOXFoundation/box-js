import CommonUtil from '../../util/util'
import Account from '../../account/account'
import Hash from '../../util/crypto/hash'
import SplitRequest from './request'

namespace Util {
  /**
   * @func make_split_address
   * @param [*split_info] {addrs,weights,txHash,index}
   * @return [split_addr]
   */
  export const calcSplitAddr = ({
    addrs,
    weights,
    txHash,
    index
  }: SplitRequest.CalcSplitAddrReq) => {
    /* check length */
    if (addrs.length !== weights.length) {
      throw new Error(`Address count doesn't match weight count`)
    }

    /* opcoder */
    const op = new CommonUtil.Opcoder('')
    for (let i = 0; i < addrs.length; i++) {
      const weight = CommonUtil.putUint32(Buffer.alloc(4), weights[i])
      const pkh = Buffer.from(Account.dumpPubKeyHashFromAddr(addrs[i]), 'hex')
      op.add(pkh).add(weight)
    }

    /* make raw */
    const splitHashBs = Hash.ripemd160(Hash.sha256(op.getCode()))
    const idxBytes = CommonUtil.putUint32(Buffer.alloc(4), index)
    const hashBytes = Buffer.from(txHash, 'hex')
    const raw = Buffer.concat([hashBytes, idxBytes, splitHashBs])

    return Hash.ripemd160(Hash.sha256(raw)).toString('hex')
  }
}

export default Util
