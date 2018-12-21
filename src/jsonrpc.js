import RpcError from './rpcerror';

export default class JsonRpc {
  constructor({ endpoint, fetch }) {
    if (!endpoint) {
      throw new Error('option.endpoint is required!');
    }
    if (!fetch) {
      throw new Error('option.fetch is required!');
    }

    this.endpoint = endpoint;
    this.publicPath = '/v1/ctl';
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
    let res;
    let json;
    try {
      res = await this._fetch(this.endpoint + this.publicPath + path, {
        body: JSON.stringify(body),
        method: 'POST'
      });
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
    return await this.fetch('/getblockheight');
  };

  /**
   *  getBlockHash returns block hash of given height
   *
   * @param {number} height
   * @returns
   * @memberof JsonRpc
   */
  getBlockHash = async height => {
    return await this.fetch('/getblockhash', { height });
  };

  /**
   *  getBlockHeader returns header info of a block given the block hash
   *
   * @param {string} block_hash
   * @returns
   * @memberof JsonRpc
   */
  getBlockHeader = async block_hash => {
    return await this.fetch('/getblockheader', { block_hash });
  };

  /**
   * getBlock returns block info given a block hash
   *
   * @param {string} block_hash
   * @returns
   * @memberof JsonRpc
   */
  getBlock = async block_hash => {
    return await this.fetch('/getblock', { block_hash });
  };

  /**
   * Get the balance of an address
   *
   * @param {[]<string>} addrs
   * @returns
   * @memberof JsonRpc
   */
  getBalance = async addrs => {
    return await this.fetch('/getbalance', { addrs });
  };

  /**
   * List transactions relate to an address
   *
   * @returns
   * @memberof JsonRpc
   */
  listTransactions = async addr => {
    return await this.fetch('/listtransactions', { addr });
  };
}
