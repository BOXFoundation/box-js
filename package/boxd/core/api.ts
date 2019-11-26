import BN from "bn.js"
import { Fetch } from "../util/fetch"
import PrivateKey from "../util/crypto/privatekey"
import UtilInterface from "../util/interface"
import SplitRequest from "./split/request"
import TokenRequest from "./token/request"
import TxRequest from "./tx/request"
import ContractRequest from "./contract/request"
import ContractResponse from "./contract/response"
import BlockResponse from "./block/response"
import SplitResponse from "./split/response"
import TokenResponse from "./token/response"
import TxResponse from "./tx/response"
import Util from "../util/util"

/**
 * @class [Api]
 * @extends Fetch
 * @constructs _fetch user incoming
 * @constructs endpoint user incoming
 * @constructs fetch_type http / rpc
 */
export default class Api extends Fetch {
  public constructor(_fetch, endpoint: string, fetch_type: string) {
    super(_fetch, endpoint, fetch_type)
  }

  /* == Node & Block == */

  /**
   * @func [Get_node_info]
   * @Permission Admin
   */
  public getNodeInfo(): Promise<BlockResponse.NodeInfo> {
    return super.fetch("/ctl/getnodeinfo")
  }

  public getBlockHashByHeight(height: number): Promise<{ hash: string }> {
    return super.fetch("/ctl/getblockhash", { height })
  }

  public getCurrentBlockHeight(): Promise<{
    height: number;
  }> {
    return super.fetch("/ctl/getcurrentblockheight")
  }

  /**
   * @func [View_block_detail]
   * @by 'block_hash' | 'block_height'
   */
  public viewBlockDetail(
    type: string,
    param: string | number
  ): Promise<BlockResponse.BlcokDetail> {
    if (type === "block_hash") {
      return super.fetch("/block/detail", { hash: param })
    } else {
      return super.fetch("/block/detail", { height: param })
    }
  }

  /**
   * @func [Get_block_header]
   * @by 'block_hash' | 'block_height'
   */
  public async getBlockHeader(
    type: string,
    param: string | number
  ): Promise<{ header: BlockResponse.BlockHeader }> {
    if (type === "block_hash") {
      return super.fetch("/ctl/getblockheader", { block_hash: param })
    } else {
      const block_hash = await this.getBlockHashByHeight(Number(param))

      return super.fetch("/ctl/getblockheader", {
        block_hash: block_hash.hash
      })
    }
  }

  public getNonce(addr: string): Promise<{ nonce: number }> {
    return super.fetch("/account/nonce", { addr })
  }

  /* == For All Transaction == */
  public signTxByPrivKey(
    unsigned_tx: UtilInterface.SignedTxByPrivKeyReq
  ): Promise<UtilInterface.TX> {
    const _privKey = unsigned_tx.privKey
    const privK = new PrivateKey(_privKey)

    return privK.signTxByPrivKey(unsigned_tx)
  }

  public sendTx(signed_tx: UtilInterface.TX): Promise<{ hash: string }> {
    return super.fetch("/tx/sendtransaction", { tx: signed_tx })
  }

  public viewTxDetail(hash: string): Promise<TxResponse.TxDetail> {
    return super.fetch("/tx/detail", { hash })
  }

  /* == BOX == */
  public faucet(faucet_info: TxRequest.FaucetInfoReq) {
    return super.fetch("/faucet/claim", faucet_info)
  }

  /* make unsigned BOX TX */
  public async getBalance(addr: string): Promise<{ balance: number }> {
    const res = await super.fetch("/tx/getbalance", {
      addrs: [addr]
    })

    return new BN(res.balances[0], 10).toString()
  }

  public async getBalances(addrs: string[]): Promise<{ balances: number[] }> {
    const res = await super.fetch("/tx/getbalance", { addrs })

    return await res.balances.map(balance => {
      return new BN(balance, 10).toString()
    })
  }

  public makeUnsignedBOXTx(
    org_tx: TxRequest.OriginalTxReq
  ): Promise<UtilInterface.UnsignedTx> {
    return super.fetch("/tx/makeunsignedtx", org_tx)
  }

  public fetchUtxos(
    utxos_req: TxRequest.FetchUtxosReq
  ): Promise<{ utxos: TxResponse.Utxo[] }> {
    return super.fetch("/tx/fetchutxos", utxos_req)
  }

  /**
   * @func create_raw_tx
   * @branch [next__sendTx_||_sendRawTx]
   * @step [fetchUtxos->makeUnsignTx->signTxByPrivKey]
   *
   * @param [*raw]
   * @param [?is_raw] boolean # is send raw tx ?
   * @returns [signed_tx]
   */
  public async createRawTx(raw: TxRequest.Raw, is_raw?) {
    // console.log("=> [Create raw TX]")
    try {
      const { addr, to, privKey } = raw
      let total_to = new BN(0, 10)

      /* make total_to */
      Object.keys(to).forEach(addr => {
        total_to = total_to.add(new BN(to[addr], 10))
      })
      // console.log('[Create raw TX] fetchUtxos param :', addr, total_to.toString())

      /* fetch utxos */
      const utxo_res = await this.fetchUtxos({
        addr,
        amount: total_to.toString()
      })
      // console.log('[Create raw TX] fetchUtxos res :', JSON.stringify(utxo_res))

      if (utxo_res["code"] === 0) {
        /* make unsigned tx */
        const utxo_list = utxo_res.utxos
        let unsigned_tx = await Util.makeUnsignedTxHandle({
          from: addr,
          to_map: to,
          utxo_list,
          is_raw
        })
        // console.log('[Create raw TX] unsigned tx :', JSON.stringify(unsigned_tx))

        /* sign tx by privKey */
        return await this.signTxByPrivKey({
          unsignedTx: unsigned_tx.tx_json,
          privKey,
          protocalTx: unsigned_tx.protocalTx
        })
      } else {
        throw new Error("Fetch utxos Error !")
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  /*TODO public sendRawTx(raw_tx) {
    return super.fetch("/tx/sendrawtransaction", { tx: raw_tx })
  } */

  /* Contract */
  public makeUnsignedContractTx(
    org_tx: ContractRequest.OriginalContractReq
  ): Promise<ContractResponse.UnsignedContractTx> {
    return super.fetch("/tx/makeunsignedtx/contract", org_tx)
  }

  public callContract(
    org_tx: ContractRequest.CallContractReq
  ): Promise<ContractResponse.CallContractResp> {
    return super.fetch("/contract/call", org_tx)
  }

  public getLogs(
    logs_req: ContractRequest.GetLogsReq
  ): Promise<ContractResponse.LogDetail[]> {
    return super.fetch("/contract/getLogs", logs_req)
  }

  /* == Split Contract == */
  public makeUnsignedSplitAddrTx(
    split_addr_tx: SplitRequest.SplitAddrTxReq
  ): Promise<SplitResponse.UnsignedSplitAddrTx> {
    return super.fetch("/tx/makeunsignedtx/splitaddr", split_addr_tx)
  }

  /* == Token == */
  public async getTokenbalance(
    token: TokenRequest.TokenBalanceReq
  ): Promise<{ balance: number }> {
    token["addrs"] = [token.addr]
    const balances = await super.fetch("/tx/gettokenbalance", token)
    const arr_balances = await balances.balances.map(balance => {
      return new BN(balance, 10).toString()
    })

    return { balance: arr_balances[0] }
  }

  public async getTokenbalances(
    tokens: TokenRequest.TokenBalancesReq
  ): Promise<{ balances: number[] }> {
    const balances = await super.fetch("/tx/gettokenbalance", tokens)
    const arr_balances = await balances.balances.map(balance => {
      return new BN(balance, 10).toString()
    })

    return { balances: arr_balances }
  }

  public makeUnsignedTokenIssueTx(
    token_issue_tx: TokenRequest.IssueTokenReq
  ): Promise<TokenResponse.UnsignedTokenIssueTx> {
    return super.fetch("/tx/makeunsignedtx/token/issue", token_issue_tx)
  }

  public makeUnsignedTokenTx(
    token_transfer_tx: TokenRequest.OriginalTokenTxReq
  ): Promise<UtilInterface.UnsignedTx> {
    return super.fetch("/tx/makeunsignedtx/token/transfer", token_transfer_tx)
  }

  /*TODO public fetchTokenUtxos(fetch_utxos_req: TxRequest.FetchUtxosReq) {
    return super.fetch("/todo", fetch_utxos_req)
  } */
}
