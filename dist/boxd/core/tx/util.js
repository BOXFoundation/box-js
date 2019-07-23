"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bn_js_1 = __importDefault(require("bn.js"));
var block_pb_js_1 = __importDefault(require("../../../protobuf/js/block_pb.js"));
var account_1 = __importDefault(require("../../account/account"));
var util_1 = __importDefault(require("../../util/util"));
var Util;
(function (Util) {
    /**
     * @func Make_Unsigned_transaction_handle
     * @param [*param] {utxo_list: TxResponse.Utxo[]; is_raw?: boolean}
     * @branch [next__sendTx_||_sendRawTx]
     * @step [check->add_vout->add_charge->add_vin]
     * @returns [tx_json] # tx type of json {rawMsgs: []}
     * @returns [protocalTx] # tx type of protocal
     */
    Util.makeUnsignedTxHandle = function (param) {
        // console.log('makeUnsignedTxHandle param ===', JSON.stringify(param))
        var from = param.from, to_map = param.to_map, fee = param.fee, utxo_list = param.utxo_list, is_raw = param.is_raw;
        var total_to = new bn_js_1.default(0, 10); // total tx count (big number)
        var total_utxo = new bn_js_1.default(0, 10); // total account utxo (big number)
        var rowmsg_list = []; // row message list
        var vin_list = []; // vin list (json)
        var vout_list = []; // vout list (json)
        var vin_list_proto = []; // vin list (protobuf)
        var vin_list_proto_row = []; // vin list (protobuf)
        var vout_list_proto = []; // vout list (protobuf)
        /* check utxo */
        if (utxo_list.length < 1) {
            throw new Error('Utxo error');
        }
        /* utxo sum */
        utxo_list.forEach(function (utxo) {
            total_utxo = total_utxo.add(new bn_js_1.default(utxo.tx_out.value, 10));
        });
        // console.log('total_utxo :', total_utxo.toString())
        /* tx count sum */
        Object.keys(to_map).forEach(function (to) {
            total_to = total_to.add(new bn_js_1.default(to_map[to], 10));
        });
        total_to = total_to.add(new bn_js_1.default(fee, 10));
        // console.log('total_to :', total_to.toString())
        /* check balance */
        if (total_to.toNumber() > total_utxo.toNumber()) {
            throw new Error("The balance of " + from + " is too low");
        }
        /* ======================== */
        /* vout */
        var acc = new account_1.default();
        var op = new util_1.default.Opcoder('');
        Object.keys(to_map).forEach(function (to_addr) {
            var pub_hash = acc.dumpPubKeyHashFromAddr(to_addr);
            // console.log('pub_hash_1 :', pub_hash)
            // + script_pub_key
            var script = op
                .reset('')
                .add(util_1.default.getHexStrFromNumber(op.OP_DUP))
                .add(util_1.default.getHexStrFromNumber(op.OP_HASH_160))
                .add(pub_hash)
                .add(util_1.default.getHexStrFromNumber(op.OP_EQUAL_VERIFY))
                .add(util_1.default.getHexStrFromNumber(op.OP_CHECK_SIG))
                .getCode();
            // console.log('script :', script.toString('base64'))
            // + value
            var vout = new block_pb_js_1.default.TxOut();
            vout.setScriptPubKey(script.toString('base64'));
            vout.setValue(to_map[to_addr]);
            vout_list_proto.push(vout);
            // make tx vout (json)
            vout_list.push({
                value: to_map[to_addr],
                script_pub_key: script.toString('base64')
            });
        });
        /* ======================== */
        /* charge */
        if (total_to.toNumber() < total_utxo.toNumber()) {
            var charge = total_utxo.sub(total_to).toString();
            // console.log('charge :', charge)
            var pub_hash = acc.dumpPubKeyHashFromAddr(from);
            // console.log('pub_hash_2 :', pub_hash)
            // + script_pub_key
            var script = op
                .reset('')
                .add(util_1.default.getHexStrFromNumber(op.OP_DUP))
                .add(util_1.default.getHexStrFromNumber(op.OP_HASH_160))
                .add(pub_hash)
                .add(util_1.default.getHexStrFromNumber(op.OP_EQUAL_VERIFY))
                .add(util_1.default.getHexStrFromNumber(op.OP_CHECK_SIG))
                .getCode();
            // console.log('script :', script.toString('base64'))
            // + value
            var vout = new block_pb_js_1.default.TxOut();
            vout.setScriptPubKey(script.toString('base64'));
            vout.setValue(charge);
            vout_list_proto.push(vout);
            // make tx vout (json)
            vout_list.push({
                value: charge,
                script_pub_key: script.toString('base64')
            });
        }
        // console.log('vout_list :', vout_list)
        // console.log('vout_list_proto :', vout_list_proto)
        /* ======================== */
        /* vin */
        // make tx vin (json)
        utxo_list.forEach(function (utxo) {
            vin_list.push({
                prev_out_point: {
                    hash: utxo.out_point.hash,
                    index: utxo.out_point.index
                },
                script_sig: utxo.tx_out.script_pub_key
            });
        });
        // console.log('vin_list :', JSON.stringify(vin_list))
        // make tx vin (protobuf)
        var protocalTx = new block_pb_js_1.default.Transaction();
        var tx_proto_row = new block_pb_js_1.default.Transaction();
        var _loop_1 = function (vin_i) {
            vin_list.forEach(function (vin, i) {
                // + prev_out_point
                var out_point = new block_pb_js_1.default.OutPoint();
                // console.log('out_point org :', out_point)
                out_point.setHash(vin.prev_out_point.hash);
                out_point.setIndex(vin.prev_out_point.index);
                // console.log('out_point :', out_point)
                // + script_sig
                var vin_proto = new block_pb_js_1.default.TxIn();
                var vin_proto_row = new block_pb_js_1.default.TxIn();
                // console.log('vin_proto org :', vin_proto)
                vin_proto.setPrevOutPoint(out_point);
                vin_proto_row.setPrevOutPoint(out_point);
                vin_proto_row.setScriptSig(vin.script_sig);
                if (i === vin_i) {
                    vin_proto.setScriptSig(vin.script_sig);
                }
                // console.log('vin_proto :', vin_proto)
                vin_list_proto.push(vin_proto);
                vin_list_proto_row.push(vin_proto_row);
            });
            protocalTx.setVinList(vin_list_proto);
            protocalTx.setVoutList(vout_list_proto);
            tx_proto_row.setVinList(vin_list_proto_row);
            tx_proto_row.setVoutList(vout_list_proto);
            // serialize binary
            rowmsg_list.push(protocalTx.serializeBinary());
        };
        for (var vin_i = 0; vin_i < vin_list.length; vin_i++) {
            _loop_1(vin_i);
        }
        // console.log('rowmsg_list :', rowmsg_list)
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
                        lock_time: '0'
                    },
                    rawMsgs: rowmsg_list
                },
                protocalTx: tx_proto_row
            };
        }
        else {
            return {
                tx_json: {
                    tx: {
                        version: 0,
                        vin: vin_list,
                        vout: vout_list,
                        data: null,
                        magic: 0,
                        lock_time: '0'
                    },
                    rawMsgs: rowmsg_list
                },
                protocalTx: null
            };
        }
    };
})(Util || (Util = {}));
exports.default = Util;
