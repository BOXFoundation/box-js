import TxRequest from './request'
import block_pb from '../../../protobuf/block_pb.js'
import Account from '../../account/account'
import CommonUtil from '../../util/util'

const OPCODE_TYPE = 'hex'

namespace Util {
  export const makeUnsignTx = (param: TxRequest.MakeUnsignTxReq) => {
    console.log('makeUnsignTx param :', JSON.stringify(param))
    const { to_map, fee, utxo_list } = param
    let total_to = 0 // total tx count
    let vin_list: any = []
    let vout_list: any = []

    Object.keys(to_map).forEach(key => {
      total_to += Number(to_map[key])
    })
    total_to += Number(fee)
    console.log('total_to :', total_to)

    // TODO check

    // const tx_builder = new block_pb.Transaction()

    /* vin */
    utxo_list.forEach(utxo => {
      // prev_out_point
      const out_point = new block_pb.OutPoint()
      console.log('out_point org :', out_point)
      out_point.setHash(utxo.out_point.hash)
      out_point.setIndex(utxo.out_point.index)
      console.log('out_point :', out_point)
      // + script_sig
      const vin = new block_pb.TxIn()
      console.log('vin org :', vin)
      vin.setPrevOutPoint(out_point)
      vin.setScriptSig(utxo.tx_out.script_pub_key)
      console.log('vin :', vin)
      vin_list.push(vin)
    })
    console.log('vin_list :', vin_list)

    /* vout */
    const acc = new Account()
    Object.keys(to_map).forEach(key => {
      const pub_hash = acc.dumpPubKeyHashFromAddr(key)
      // script_pub_key
      console.log('pub_hash :', pub_hash)
      const op = new CommonUtil.Opcoder('')
      const script = op
        .add(op.OP_DUP)
        .add(op.OP_HASH_160)
        .add(pub_hash)
        .add(op.OP_EQUAL_VERIFY)
        .add(op.OP_CHECK_SIG)
        .getCode()
      // + value
      const vout = new block_pb.TxOut()
        .setScriptPubKey(script.toString(OPCODE_TYPE))
        .setValue(to_map[key])
      vout_list.push(vout)
    })
    console.log('vout_list :', vout_list)

    /* charge */
  }
}

export default Util
