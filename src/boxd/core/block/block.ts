import { fetchRPC } from '../../util/rpc'

namespace Block {
  /**
   * @export add-Node
   * @param [*nodeId] string
   * @returns [promise]
   */
  export const addNode = async (
    _fetch: any,
    endpoint: string,
    nodeId: string
  ) => {
    return fetchRPC(_fetch, endpoint, '/ctl/addnode', { nodeId })
  }

  /**
   * @export get-Block-by-Height
   * @param [height] number
   * @returns [promise]
   */
  export const getBlockByHeight = async (
    _fetch: any,
    endpoint: string,
    height: number
  ) => {
    return await fetchRPC(_fetch, endpoint, '/ctl/getblock', { height })
  }

  /**
   * @export get-Block-by-BlockHash
   * @param [blockHash] string
   * @returns [promise]
   */
  export const getBlockByBlockHash = async (
    _fetch: any,
    endpoint: string,
    blockHash: string
  ) => {
    return await _fetch(_fetch, endpoint, '/ctl/getblock', blockHash)
  }

  /**
   * @export get-BlockHash
   * @param [blockHeight] number
   * @returns [promise]
   */
  export const getBlockHash = async (
    _fetch: any,
    endpoint: string,
    blockHeight: number
  ) => {
    return await _fetch(_fetch, endpoint, '/ctl/getblockhash', blockHeight)
  }

  /**
   * @export get-BlockHeader-by-Height
   * @param [height] number
   * @returns [promise]
   */
  export const getBlockHeaderByHeight = async (
    _fetch: any,
    endpoint: string,
    height: number
  ) => {
    return await _fetch(_fetch, endpoint, '/ctl/getblockheader', height)
  }

  /**
   * @export get-BlockHeader-by-Hash
   * @param [hash] string
   * @returns [promise]
   */
  export const getBlockHeaderByHash = async (
    _fetch: any,
    endpoint: string,
    hash: string
  ) => {
    return await _fetch(_fetch, endpoint, '/ctl/getblockheader', hash)
  }

  /**
   * @export get-BlockHeight
   * @param null
   * @returns [promise]
   */
  export const getBlockHeight = async (_fetch: any, endpoint: string) => {
    return await _fetch(_fetch, endpoint, '/ctl/getblockheight')
  }

  /**
   * @export get-NodeInfo
   * @param null
   * @returns [promise]
   */
  export const getNodeInfo = async (_fetch: any, endpoint: string) => {
    return await _fetch(_fetch, endpoint, '/ctl/getnodeinfo')
  }

  /**
   * @export view-BlockDetail
   * @param [hash] string
   * @returns [promise]
   */
  export const viewBlockDetail = async (
    _fetch: any,
    endpoint: string,
    hash: string
  ) => {
    return _fetch(_fetch, endpoint, '/block/detail', hash)
  }
}
export default Block
