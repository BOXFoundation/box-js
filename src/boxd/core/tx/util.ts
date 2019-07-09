import TxRequest from './request'
import block_pb from '../../../protobuf/block_pb.js'

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
      out_point.setHash(utxo.out_point.hash)
      out_point.setIndex(utxo.out_point.index)
      // script_sig
      const tx = new block_pb.TxIn()
        .setPrevOutPoint(out_point)
        .setScriptSig(utxo.tx_out.script_pub_key)
      vins_list.push(tx)
    })
  }
}

export default Util
