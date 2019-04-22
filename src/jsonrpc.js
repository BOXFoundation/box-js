import RpcError from './rpc-error'
import {
  signTxWithAcc,
  checkTx
} from './tx'

/* const checkResStatus = async res => {
  if (res.status >= 400) {
    let data = {
      code: res.status,
      status: res.status,
      statusText: res.statusText
    }
    try {
      const resData = await res.json()
      data.msg = resData.msg
    } catch (error) {
      data.msg = res.statusText
    }
    return Promise.reject(data)
  }
  return await res.json()
} */

export default class JsonRpc {
  constructor({
    endpoint,
    fetch
  }) {
    if (!endpoint) {
      throw new Error('rpc.endpoint is required!')
    }
    if (!fetch) {
      throw new Error('rpc.fetch is required!')
    }
    this.endpoint = endpoint
    this.publicPath = '/v1'
    this._fetch = fetch
  }

  /**
   * @func fetch-encapsulation
   * @param {string} path
   * @param {object} body
   * @returns {object} fetch
   * @memberof JsonRpc
   */
  fetch = async (path, body = {}) => {
    console.log(`[fetch:${path}]:\n`, JSON.stringify(body), '\n')
    let res
    let fetch = {
      path
    }
    try {
      res = await this._fetch(this.endpoint + this.publicPath + path, {
        body: JSON.stringify(body),
        method: 'POST'
      })
      if (res.status >= 400) {
        fetch.code = res.status
        fetch.statusText = res.statusText
        throw new RpcError(fetch)
      }
      fetch = await res.json()
      if (fetch.code !== 0) {
        throw new RpcError(fetch)
      }
    } catch (e) {
      e.isFetchError = true
      throw e
    }
    if (!res.ok) {
      throw new RpcError(fetch)
    }
    return fetch
  }

  /**
   * getBlockHeight returns height of current tail block
   * @returns
   * @memberof JsonRpc
   */
  getBlockHeight = async () => {
    return await this.fetch('/ctl/getblockheight')
  }

  /**
   *  getBlockHash returns block hash of given height
   *
   * @param {number} height
   * @returns
   * @memberof JsonRpc
   */
  getBlockHash = async height => {
    return await this.fetch('/ctl/getblockhash', {
      height
    })
  }

  /**
   *  getBlockHeader returns header info of a block given the block hash
   *
   * @param {string} block_hash
   * @returns
   * @memberof JsonRpc
   */
  getBlockHeader = async block_hash => {
    return await this.fetch('/ctl/getblockheader', {
      block_hash
    })
  }

  /**
   * getBlock returns block info given a block hash
   *
   * @param {string} block_hash
   * @returns
   * @memberof JsonRpc
   */
  getBlock = async block_hash => {
    return await this.fetch('/ctl/getblock', {
      block_hash
    })
  }

  /**
   * Get the balance of an address
   *
   * @param {[]<string>} addrs
   * @returns
   * @memberof JsonRpc
   */
  getBalance = async addrs => {
    return await this.fetch('/tx/getbalance', {
      addrs
    })
  }

  /**
   * Get the balance of an token address
   *
   * @param {token 信息} addrs token_hash token_index
   * @returns
   * @memberof JsonRpc
   */
  getTokenBalance = async param => {
    return await this.fetch('/tx/gettokenbalance', param)
  }

  /**
   * Get the balance of an address
   *
   * @param {string} addr
   * @param {number} amount
   * @returns
   * @memberof JsonRpc
   */
  fetchUtxos = async (addr, amount) => {
    return await this.fetch('/tx/fetchutxos', {
      Addr: addr,
      Amount: amount
    })
  }

  /**
   * List transactions relate to an address
   *
   * @param {string} addr
   * @returns
   * @memberof JsonRpc
   */
  listTransactions = async addr => {
    return await this.fetch('/wlt/listtransactions', {
      addr
    })
  }

  /**
   * makeneedsigntx
   * @param {string} block_hash
   * @param {[]string} toAddrs
   * @param {[]<number>} amounts
   * @param {number} fee
   * @memberof JsonRpc
   */
  makeUnsignedTx = async (from, to = [], amounts = [], fee) => {
    return await this.fetch('/tx/makeunsignedtx', {
      from,
      to,
      amounts,
      fee
    })
  }

  /**
   * makeneedsigntx
   * @param {string} issuer
   * @param {string} owner
   * @param { {name, symbol, supply, decimal} } tag
   * @param {number} fee
   * @memberof JsonRpc
   */
  makeCreateIssueTx = async (issuer, owner, tag = {}, fee) => {
    return await this.fetch('/tx/makeunsignedtx/token/issue', {
      issuer,
      owner,
      tag,
      fee
    })
  }

  /**
   * createIssueSendTrans
   * @param {any} acc # Account info
   * @param {string} issuer
   * @param {string} owner
   * @param { {name, symbol, supply, decimal} } tag # Token info
   * @param {number} fee
   * @memberof JsonRpc
   */
  createIssueSendTrans = async ({
    acc,
    issuer,
    owner,
    tag = {},
    fee
  }) => {
    console.log('acc, tag:', acc, tag)
    const baseTx = await this.makeCreateIssueTx(issuer, owner, tag, fee)
    console.log('baseTx:', JSON.stringify(baseTx, null, 2))
    const {
      issue_out_index: token_index,
      tx: token_tx,
      rawMsgs
    } = baseTx
    const amounts = 0
    const signedTx = signTxWithAcc(acc, token_tx, rawMsgs)
    checkTx(token_tx, {
      acc,
      issuer,
      owner,
      amounts,
      fee
    })
    const result = await this.sendTransactionRaw(signedTx)
    return {
      result,
      token_index
    }
  }

  /**
   * makeSplitAddrTx
   * @param {string} block_hash
   * @param {[]string} addrs
   * @param {[]<number>} weights
   * @param {number} fee
   * @memberof JsonRpc
   */
  makeSplitAddrTx = async (from, addrs = [], weights = [], fee) => {
    return await this.fetch('/tx/makeunsignedtx/splitaddr', {
      from,
      addrs,
      weights,
      fee
    })
  }

  /**
   * makeIssueAddrTx
   * @param {string} token_id
   * @param {string} from_address
   * @param {[]string} to_address
   * @param {[]<number>} amounts
   * @memberof JsonRpc
   */
  makeIssueAddrTx = async (
    token_hash,
    token_index,
    from,
    to = [],
    amounts = [],
    fee
  ) => {
    return await this.fetch('/tx/makeunsignedtx/token/transfer', {
      token_hash,
      token_index,
      from,
      to,
      amounts,
      fee
    })
  }

  /**
   * sendTransaction
   * @param {any} acc
   * @param {string} block_hash
   * @param {[]string} toAddrs
   * @param {[]<number>} amounts
   * @param {number} fee
   *
   * @memberof JsonRpc
   */
  sendTransaction = async (
    acc,
    fromAddr,
    toAddrs = [],
    amounts = [],
    fee
  ) => {
    console.log('toAddrs, amounts:', toAddrs, amounts)
    const baseTx = await this.makeUnsignedTx(
      fromAddr,
      toAddrs,
      amounts,
      fee
    )
    console.log('baseTx:', JSON.stringify(baseTx, null, 2))
    const {
      tx,
      rawMsgs
    } = baseTx
    const signedTx = signTxWithAcc(acc, tx, rawMsgs)
    checkTx(tx, {
      acc,
      fromAddr,
      toAddrs,
      amounts,
      fee
    })
    return await this.sendTransactionRaw(signedTx)
  }

  /**
   * sendSplitTransaction
   * @param {any} acc
   * @param {string} block_hash
   * @param {[]string} toAddrs
   * @param {[]<number>} weights
   * @param {number} fee
   *
   * @memberof JsonRpc
   */
  sendSplitTransaction = async (
    acc,
    fromAddr,
    toAddrs = [],
    weights = [],
    fee
  ) => {
    console.log('toAddrs, weights:', toAddrs, weights)
    const baseTx = await this.makeSplitAddrTx(
      fromAddr,
      toAddrs,
      weights,
      fee
    )
    console.log('baseTx:', JSON.stringify(baseTx, null, 2))
    const {
      tx,
      rawMsgs,
      splitAddr
    } = baseTx
    const signedTx = signTxWithAcc(acc, tx, rawMsgs)
    checkTx(tx, {
      acc,
      fromAddr,
      toAddrs,
      weights,
      fee
    })
    const res = await this.sendTransactionRaw(signedTx)
    return {
      ...res,
      splitAddr
    }
  }

  /**
   * sendIssueTransaction #（ acc, token_hash, token_index, from_address, to_address, amount, fee）
   * @param {any} acc
   * @param {string} token_hash
   * @param {number} token_index
   * @param {string} from_address
   * @param {[]string} to_address
   * @param {[]<number>} amounts
   * @param {number} fee
   *
   * @memberof JsonRpc
   */
  sendIssueTransaction = async ({
    acc,
    token_hash,
    token_index,
    from_address = '',
    to_address = [],
    amounts = [],
    fee
  }) => {
    console.log(
      'sendIssueTransaction to_address, amounts======',
      to_address,
      amounts
    )
    const baseTx = await this.makeIssueAddrTx(
      token_hash,
      token_index,
      from_address,
      to_address,
      amounts,
      fee
    )
    console.log('baseTx:', JSON.stringify(baseTx, null, 2))
    const {
      tx,
      rawMsgs
    } = baseTx
    const signedTx = signTxWithAcc(acc, tx, rawMsgs)
    checkTx(tx, {
      acc,
      token_hash,
      token_index,
      from_address,
      to_address,
      amounts,
      fee
    })
    const res = await this.sendTransactionRaw(signedTx)
    return {
      ...res
    }
  }

  /**
   * sendTransactionRaw
   *
   * @memberof JsonRpc
   */
  sendTransactionRaw = async tx => {
    return await this.fetch('/tx/sendtransaction', {
      tx
    })
  }

  /**
   * Get the detail of a hash
   * @param {<string>} hash
   * @memberof JsonRpc
   */
  viewTxDetail = async hash => {
    return await this.fetch('/tx/detail', {
      hash
    })
  }

  /**
   * getBlockByHash
   *
   *
   */
  getBlockByHash = async hash => {
    return await this.fetch('/webapi/getblock', {
      hash
    })
  }

  /**
   * Get the balance of a token
   *
   * @param {[]<string>} addrs
   * @param {<string>} token_hash
   * @param {<string>} token_index
   * @returns
   * @memberof JsonRpc
   */
  getTokenBalance = async ({
    addrs,
    token_hash,
    token_index
  }) => {
    return await this.fetch('/tx/gettokenbalance', {
      addrs,
      token_hash,
      token_index
    })
  }
}