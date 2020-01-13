import BN from "bn.js"
import block_pb from "../../util/protobuf-js/block_pb.js"
import Account from "../../account/account"
import Util from "../../util/util"
import TxRequest from "./request"

namespace TxUtil {
  /**
   * @func Make_Unsigned_transaction_handle
   * @param [*param] {utxo_list: TxResponse.Utxo[]; is_raw?: boolean}
   * @branch [next__sendTx_||_sendRawTx]
   * @step [check->add_vout->add_charge->add_vin]
   * @returns [tx_json] # tx type of json {rawMsgs: []}
   * @returns [protocalTx] # tx type of protocal
   */
  export const makeUnsignedTxHandle = (param: TxRequest.MakeUnsignTxReq) => {
    // console.log('=> [Make unsigned TX handle] param :', JSON.stringify(param))
    const { from, to_map, utxo_list, is_raw } = param
    let total_to = new BN(0, 10) // total tx count (big number)
    let total_utxo = new BN(0, 10) // total account utxo (big number)
    let raw_hash_list: any = [] // row message list
    let vin_list: any = [] // vin list (json)
    let vout_list: any = [] // vout list (json)
    let vin_list_proto: any = [] // vin list (protobuf)
    let vin_list_proto_row: any = [] // vin list (protobuf)
    let vout_list_proto: any = [] // vout list (protobuf)

    /* check utxo */
    if (utxo_list.length < 1) {
      throw new Error("Utxo error")
    }

    const fee = (Math.floor(utxo_list.length / 16) + 1) * 1050000
    // console.log("[Make unsigned TX handle] fee :", fee)

    /* utxo sum */
    utxo_list.forEach(utxo => {
      total_utxo = total_utxo.add(new BN(utxo.tx_out.value, 10))
    })
    // console.log('[Make unsigned TX handle] total_utxo :', total_utxo.toString())

    /* tx count sum */
    Object.keys(to_map).forEach(to => {
      total_to = total_to.add(new BN(to_map[to], 10))
    })
    total_to = total_to.add(new BN(fee, 10))
    // console.log('[Make unsigned TX handle] total_to :', total_to.toString())

    /* check balance */
    if (total_to.toNumber() > total_utxo.toNumber()) {
      throw new Error(`The balance of ${from} is too low`)
    }

    /* ======================== */

    /* vout */
    const op = new Util.Opcoder("")
    Object.keys(to_map).forEach(to_addr => {
      const pub_hash = Account.dumpPubKeyHashFromAddr(to_addr)
      // console.log('[Make unsigned TX handle] pub_hash_1 :', pub_hash)

      // + script_pub_key
      const script = op
        .reset("")
        .add(Util.to16StrFromNumber(op.OP_DUP))
        .add(Util.to16StrFromNumber(op.OP_HASH_160))
        .add(pub_hash)
        .add(Util.to16StrFromNumber(op.OP_EQUAL_VERIFY))
        .add(Util.to16StrFromNumber(op.OP_CHECK_SIG))
        .getCode()
      // console.log('[Make unsigned TX handle] script :', script.toString('base64'))

      // + value
      const vout = new block_pb.TxOut()
      vout.setScriptPubKey(script.toString("base64"))
      vout.setValue(to_map[to_addr])
      vout_list_proto.push(vout)

      // make tx vout (json)
      vout_list.push({
        value: to_map[to_addr],
        script_pub_key: script.toString("base64")
      })
    })

    /* ======================== */

    /* charge */
    if (total_to.toNumber() < total_utxo.toNumber()) {
      const charge = total_utxo.sub(total_to).toString()
      // console.log('[Make unsigned TX handle] charge :', charge)
      const pub_hash = Account.dumpPubKeyHashFromAddr(from)
      // console.log('[Make unsigned TX handle] pub_hash_2 :', pub_hash)

      // + script_pub_key
      const script = op
        .reset("")
        .add(Util.to16StrFromNumber(op.OP_DUP))
        .add(Util.to16StrFromNumber(op.OP_HASH_160))
        .add(pub_hash)
        .add(Util.to16StrFromNumber(op.OP_EQUAL_VERIFY))
        .add(Util.to16StrFromNumber(op.OP_CHECK_SIG))
        .getCode()
      // console.log('[Make unsigned TX handle] script :', script.toString('base64'))

      // + value
      const vout = new block_pb.TxOut()
      vout.setScriptPubKey(script.toString("base64"))
      vout.setValue(charge)
      vout_list_proto.push(vout)

      // make tx vout (json)
      vout_list.push({
        value: charge,
        script_pub_key: script.toString("base64")
      })
    }
    // console.log('[Make unsigned TX handle] vout_list :', vout_list)
    // console.log('[Make unsigned TX handle] vout_list_proto :', vout_list_proto)

    /* ======================== */

    /* vin */
    // make tx vin (json)
    utxo_list.forEach(utxo => {
      vin_list.push({
        prev_out_point: {
          hash: utxo.out_point.hash,
          index: utxo.out_point.index
        },
        script_sig: utxo.tx_out.script_pub_key
      })
    })
    // console.log('[Make unsigned TX handle] vin_list :', JSON.stringify(vin_list))

    // make tx vin (protobuf)
    const protocalTx = new block_pb.Transaction()
    const tx_proto_row = new block_pb.Transaction()
    for (let vin_i = 0; vin_i < vin_list.length; vin_i++) {
      vin_list.forEach((vin, i) => {
        // + prev_out_point
        const out_point = new block_pb.OutPoint()
        // console.log('[Make unsigned TX handle] out_point org :', out_point)
        out_point.setHash(vin.prev_out_point.hash)
        out_point.setIndex(vin.prev_out_point.index)
        // console.log('[Make unsigned TX handle] out_point :', out_point)

        // + script_sig
        const vin_proto = new block_pb.TxIn()
        const vin_proto_row = new block_pb.TxIn()
        // console.log('[Make unsigned TX handle] vin_proto org :', vin_proto)
        vin_proto.setPrevOutPoint(out_point)
        vin_proto_row.setPrevOutPoint(out_point)
        vin_proto_row.setScriptSig(vin.script_sig)
        if (i === vin_i) {
          vin_proto.setScriptSig(vin.script_sig)
        }
        // console.log('[Make unsigned TX handle] vin_proto :', vin_proto)
        vin_list_proto.push(vin_proto)
        vin_list_proto_row.push(vin_proto_row)
      })
      protocalTx.setVinList(vin_list_proto)
      protocalTx.setVoutList(vout_list_proto)
      tx_proto_row.setVinList(vin_list_proto_row)
      tx_proto_row.setVoutList(vout_list_proto)

      console.log(
        "protocalTx.serializeBinary res :",
        protocalTx.serializeBinary()
      )

      // serialize binary
      raw_hash_list.push(
        Util.getSignHash(protocalTx.serializeBinary()).toString("hex")
      )
    }
    console.log("[Make unsigned TX handle] raw_hash_list :", raw_hash_list)

    /* ======================== */
    if (is_raw) {
      return {
        tx_json: {
          tx: {
            version: 0,
            vin: vin_list,
            vout: vout_list,
            data: null,
            magic: 0,
            lock_time: "0"
          },
          rawMsgs: raw_hash_list
        },
        protocalTx: tx_proto_row
      }
    } else {
      return {
        tx_json: {
          tx: {
            version: 0,
            vin: vin_list,
            vout: vout_list,
            data: null,
            magic: 0,
            lock_time: "0"
          },
          rawMsgs: raw_hash_list
        },
        protocalTx: null
      }
    }
  }
}

export default TxUtil
