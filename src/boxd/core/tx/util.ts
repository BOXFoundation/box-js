import TxRequest from './request'
import block_pb from '../../../protobuf/block_pb.js'
import Account from '../../account/account'
import CommonUtil from '../../util/util'

const OPCODE_TYPE = 'hex'

namespace Util {
  export const makeUnsignTx = (param: TxRequest.MakeUnsignTxReq) => {
    console.log('makeUnsignTx param :', JSON.stringify(param))
    const { from, to_map, fee, utxo_list } = param
    let total_to = 0 // total tx count
    let total_utxo = 0
    let vin_list: any = []
    let vout_list: any = []

    /* tx count sum */
    Object.keys(to_map).forEach(key => {
      total_to += Number(to_map[key])
    })
    total_to += Number(fee)
    console.log('total_to :', total_to)

    // utxo sum
    utxo_list.forEach(utxo => {
      total_utxo += Number(utxo.tx_out.value)
    })
    console.log('total_utxo :', total_utxo)

    // TODO check

    const tx_builder = new block_pb.Transaction()

    /* vin */
    utxo_list.forEach(utxo => {
      // + prev_out_point
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
    const op = new CommonUtil.Opcoder('')
    Object.keys(to_map).forEach(key => {
      const pub_hash = acc.dumpPubKeyHashFromAddr(key)
      console.log('pub_hash_1 :', pub_hash)
      // + script_pub_key
      const script = op
        .add([op.OP_DUP])
        .add([op.OP_HASH_160])
        .add(pub_hash)
        .add([op.OP_EQUAL_VERIFY])
        .add([op.OP_CHECK_SIG])
        .getCode()
      console.log('script :', script)
      // + value
      const vout = new block_pb.TxOut()
      vout.setScriptPubKey(script.toString(OPCODE_TYPE))
      vout.setValue(to_map[key])
      vout_list.push(vout)
    })
    console.log('vout_list :', vout_list)

    /* charge */
    if (total_utxo > total_to) {
      const charge = Number(total_utxo) - Number(total_to)
      const pub_hash = acc.dumpPubKeyHashFromAddr(from)
      console.log('pub_hash_2 :', pub_hash)
      // + script_pub_key
      op.reset('')
      const script = op
        .add([op.OP_DUP])
        .add([op.OP_HASH_160])
        .add(pub_hash)
        .add([op.OP_EQUAL_VERIFY])
        .add([op.OP_CHECK_SIG])
        .getCode()
      console.log('script :', script)
      // + value
      const vout = new block_pb.TxOut()
      vout.setScriptPubKey(script.toString(OPCODE_TYPE))
      vout.setValue(charge)
      vout_list.push(vout)
    }

    console.log('vin_list :', vin_list)
    console.log('vout_list :', vout_list)

    tx_builder.setVinList(vin_list)
    tx_builder.setVoutList(vout_list)

    console.log('tx_builder :', JSON.stringify(tx_builder))

    return tx_builder
  }
}

export default Util
