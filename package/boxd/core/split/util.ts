import Util from '../../util/util'
import Account from '../../account/account'
import Hash from '../../util/crypto/hash'
import SplitRequest from './request'

namespace SplitUtil {
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
    const op = new Util.Opcoder('')
    for (let i = 0; i < addrs.length; i++) {
      const weight = Util.putUint32(Buffer.alloc(4), weights[i])
      const pkh = Buffer.from(Account.dumpPubKeyHashFromAddr(addrs[i]), 'hex')
      console.log('calcSplitAddr weight :', weight)
      console.log('calcSplitAddr pkh :', pkh)
      op.add(pkh).add(weight)
      console.log('calcSplitAddr for :', i)
    }

    /* make raw */
    const splitHashBs = Hash.ripemd160(Hash.sha256(op.getCode()))
    const idxBytes = Util.putUint32(Buffer.alloc(4), index)
    const hashBytes = Buffer.from(txHash, 'hex')
    const raw = Buffer.concat([hashBytes, idxBytes, splitHashBs])
    const split_addr = Hash.ripemd160(Hash.sha256(raw)).toString('hex')
    console.log('calcSplitAddr split_addr :', split_addr)

    return split_addr
  }
}

export default SplitUtil
