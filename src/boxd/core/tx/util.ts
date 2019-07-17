import TxRequest from './request'
import block_pb from '../../../protobuf/block_pb.js'
import Account from '../../account/account'
import CommonUtil from '../../util/util'

namespace Util {
  export const makeUnsignTx = (param: TxRequest.MakeUnsignTxReq) => {
    console.log('makeUnsignTx param :', JSON.stringify(param))
    const { from, to_map, fee, utxo_list } = param
    const rowmsg_list: any = []
    let total_to = 0 // total tx count
    let total_utxo = 0
    let vin_list: any = []
    let vout_list: any = []
    let vin_list_proto: any = []
    let vout_list_proto: any = []

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

    const tx_proto = new block_pb.Transaction()

    /* vin */
    utxo_list.forEach(utxo => {
      // + prev_out_point
      const out_point = new block_pb.OutPoint()
      console.log('out_point org :', out_point)
      out_point.setHash(utxo.out_point.hash)
      out_point.setIndex(utxo.out_point.index)
      console.log('out_point :', out_point)
      out_point.toObject()
      console.log('out_point.toObject :', out_point)
      // + script_sig
      const vin_proto = new block_pb.TxIn()
      console.log('vin_proto org :', vin_proto)
      vin_proto.setPrevOutPoint(out_point)
      vin_proto.setScriptSig(utxo.tx_out.script_pub_key)
      console.log('vin_proto :', vin_proto)
      vin_list_proto.push(vin_proto)
      rowmsg_list.push(vin_proto.serializeBinary())

      // tx vin
      vin_list.push({
        prev_out_point: {
          hash: utxo.out_point.hash,
          index: utxo.out_point.index
        },
        script_sig: null,
        sequence: 0
      })
    })
    console.log('vin_list :', JSON.stringify(vin_list))
    console.log('vin_list_proto :', JSON.stringify(vin_list_proto))

    /* vout */
    const acc = new Account()
    const op = new CommonUtil.Opcoder('')
    Object.keys(to_map).forEach(key => {
      op.reset('')
      const pub_hash = acc.dumpPubKeyHashFromAddr(key)
      console.log('pub_hash_1 :', pub_hash)
      // + script_pub_key
      const script = op
        .add(CommonUtil.getHexStrWithNumber(op.OP_DUP))
        .add(CommonUtil.getHexStrWithNumber(op.OP_HASH_160))
        .add(pub_hash)
        .add(CommonUtil.getHexStrWithNumber(op.OP_EQUAL_VERIFY))
        .add(CommonUtil.getHexStrWithNumber(op.OP_CHECK_SIG))
        .getCode()
      console.log('script :', script.toString('base64'))
      // + value
      const vout = new block_pb.TxOut()
      vout.setScriptPubKey(script.toString('base64'))
      vout.setValue(to_map[key])
      vout_list_proto.push(vout)

      // tx vout
      vout_list.push({
        value: to_map[key],
        script_pub_key: script.toString('base64')
      })
    })

    /* charge */
    if (total_utxo > total_to) {
      const charge = Number(total_utxo) - Number(total_to)
      const pub_hash = acc.dumpPubKeyHashFromAddr(from)
      console.log('pub_hash_2 :', pub_hash)
      // + script_pub_key
      op.reset('')
      const script = op
        .add(CommonUtil.getHexStrWithNumber(op.OP_DUP))
        .add(CommonUtil.getHexStrWithNumber(op.OP_HASH_160))
        .add(pub_hash)
        .add(CommonUtil.getHexStrWithNumber(op.OP_EQUAL_VERIFY))
        .add(CommonUtil.getHexStrWithNumber(op.OP_CHECK_SIG))
        .getCode()
      console.log('script :', script.toString('base64'))
      // + value
      const vout = new block_pb.TxOut()
      vout.setScriptPubKey(script.toString('base64'))
      vout.setValue(charge)
      vout_list_proto.push(vout)

      // tx vout
      vout_list.push({
        value: charge,
        script_pub_key: script.toString('base64')
      })
    }
    console.log('vout_list :', vout_list)
    console.log('vout_list_proto :', vout_list_proto)

    tx_proto.setVinList(vin_list_proto)
    tx_proto.setVoutList(vout_list_proto)

    console.log('rowmsg_list :', rowmsg_list)

    return {
      tx: {
        version: 0,
        vin: vin_list,
        vout: vout_list,
        data: null,
        magic: 0,
        lock_time: '0'
      },
      rawMsgs: rowmsg_list
      // tx_proto
    }
  }
}

export default Util
