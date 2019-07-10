import TxRequest from './request'
import block_pb from '../../../protobuf/block_pb.js'
import Account from '../../account/account'
import CommonUtil from '../../util/util'

namespace Util {
  export const makeUnsignTx = (param: TxRequest.MakeUnsignTxReq) => {
    console.log('makeUnsignTx param :', JSON.stringify(param))
    const { to_map, fee, utxo_list } = param
    let total_to = 0
    Object.keys(to_map).forEach(key => {
      total_to += Number(to_map[key])
    })
    total_to += Number(fee)
    console.log('total_to :', total_to)
    // TODO check
    // const tx_builder = new block_pb.Transaction()
    /* vin */
    let vins_list: any = []
    // prev_out_point
    utxo_list.forEach(utxo => {
      const out_point = new block_pb.OutPoint()
      console.log('out_point org :', out_point)
      out_point.setHash(utxo.out_point.hash)
      out_point.setIndex(utxo.out_point.index)
      console.log('out_point :', out_point)
      // script_sig
      const vin = new block_pb.TxIn()
      console.log('vin org :', vin)
      vin.setPrevOutPoint(out_point)
      vin.setScriptSig(utxo.tx_out.script_pub_key)
      console.log('vin :', vin)
      vins_list.push(vin)
    })
    console.log('vins_list :', vins_list)

    /* vout */
    const acc = new Account()
    Object.keys(to_map).forEach(key => {
      const pub_hash = acc.dumpPubKeyHashFromAddr(key)
      // script

    }
  }
}

export default Util
