import RpcError from './rpcerror';
import { signTxWithAcc, checkTx } from './tx';

const checkResStatus = async res => {
  if (res.status >= 400) {
    let data = {
      code: res.status,
      status: res.status,
      statusText: res.statusText
    };
    try {
      const resData = await res.json();
      data.msg = resData.msg;
    } catch (error) {
      data.msg = res.statusText;
    }
    return Promise.reject(data);
  }
  return await res.json();
};

export default class JsonRpc {
  constructor({ endpoint, fetch }) {
    if (!endpoint) {
      throw new Error('option.endpoint is required!');
    }
    if (!fetch) {
      throw new Error('option.fetch is required!');
    }

    this.endpoint = endpoint;
    this.publicPath = '/v1';
    this._fetch = fetch;
  }

  /**
   * fetch
   *
   * @param {string} path
   * @param {object} body
   * @returns
   * @memberof JsonRpc
   */
  fetch = async (path, body = {}) => {
    console.log(`[fetch:${path}]:\n`, JSON.stringify(body), '\n');
    let res;
    let json = {
      path
    };
    try {
      res = await this._fetch(this.endpoint + this.publicPath + path, {
        body: JSON.stringify(body),
        method: 'POST'
      });
      if (res.status >= 400) {
        json.code = res.status;
        json.statusText = res.statusText;
        throw new RpcError(json);
      }
      json = await res.json();
      if (json.code !== 0) {
        throw new RpcError(json);
      }
    } catch (e) {
      e.isFetchError = true;
      throw e;
    }
    if (!res.ok) {
      throw new RpcError(json);
    }
    return json;
  };

  /**
   * getBlockHeight returns height of current tail block
   *
   * @returns
   * @memberof JsonRpc
   */
  getBlockHeight = async () => {
    return await this.fetch('/ctl/getblockheight');
  };

  /**
   *  getBlockHash returns block hash of given height
   *
   * @param {number} height
   * @returns
   * @memberof JsonRpc
   */
  getBlockHash = async height => {
    return await this.fetch('/ctl/getblockhash', { height });
  };

  /**
   *  getBlockHeader returns header info of a block given the block hash
   *
   * @param {string} block_hash
   * @returns
   * @memberof JsonRpc
   */
  getBlockHeader = async block_hash => {
    return await this.fetch('/ctl/getblockheader', { block_hash });
  };

  /**
   * getBlock returns block info given a block hash
   *
   * @param {string} block_hash
   * @returns
   * @memberof JsonRpc
   */
  getBlock = async block_hash => {
    return await this.fetch('/ctl/getblock', { block_hash });
  };

  /**
   * Get the balance of an address
   *
   * @param {[]<string>} addrs
   * @returns
   * @memberof JsonRpc
   */
  getBalance = async addrs => {
    return await this.fetch('/tx/getbalance', { addrs });
  };

  /**
   * Get the balance of an address
   *
   * @param {string} addr
   * @param {number} amount
   * @returns
   * @memberof JsonRpc
   */
  fetchUtxos = async (addr, amount) => {
    return await this.fetch('/tx/fetchutxos', { Addr: addr, Amount: amount });
  };

  /**
   * List transactions relate to an address
   *
   * @param {string} addr
   * @returns
   * @memberof JsonRpc
   */
  listTransactions = async addr => {
    return await this.fetch('/wlt/listtransactions', { addr });
  };

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
    });
  };

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
    });
  };

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
  sendTransaction = async (acc, fromAddr, toAddrs = [], amounts = [], fee) => {
    console.log('toAddrs, amounts:', toAddrs, amounts);
    const baseTx = await this.makeUnsignedTx(fromAddr, toAddrs, amounts, fee);
    console.log('baseTx:', JSON.stringify(baseTx, null, 2));
    const { tx, rawMsgs } = baseTx;
    const signedTx = signTxWithAcc(acc, tx, rawMsgs);
    checkTx(tx, {
      acc,
      fromAddr,
      toAddrs,
      amounts,
      fee
    });
    return await this.sendTransactionRaw(signedTx);
  };

  /**
   * sendTransaction
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
    console.log('toAddrs, weights:', toAddrs, weights);
    const baseTx = await this.makeSplitAddrTx(fromAddr, toAddrs, weights, fee);
    console.log('baseTx:', JSON.stringify(baseTx, null, 2));
    const { tx, rawMsgs } = baseTx;
    const signedTx = signTxWithAcc(acc, tx, rawMsgs);
    checkTx(tx, {
      acc,
      fromAddr,
      toAddrs,
      weights,
      fee
    });
    return await this.sendTransactionRaw(signedTx);
  };

  /**
   * sendTransactionRaw
   *
   * @memberof JsonRpc
   */
  sendTransactionRaw = async tx => {
    return await this.fetch('/tx/sendtransaction', { tx });
  };

  viewTxDetail = async hash => {
    return await this.fetch('/tx/detail', { hash });
  };

  /**
   * getBlockByHash
   *
   *
   */
  getBlockByHash = async hash => {
    return await this.fetch('/webapi/getblock', { hash });
  };
}
