import { fetchRPC } from '../../util/rpc'

/**
 * @export add-Node
 * @param [*nodeId] string
 * @returns [response]
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
 * @returns [response]
 */
export const getBlockByHeight = async (
  _fetch: any,
  endpoint: string,
  height: number
) => {
  return await fetchRPC(_fetch, endpoint, '/ctl/getblock', { height })
}

//todo

/**
 * @export get-Block-by-BlockHash
 * @param [blockHash] string
 * @returns [response]
 */
export const getBlockByBlockHash = (_fetch: any, blockHash: string) => {
  return _fetch('/ctl/getblock', blockHash)
}

/**
 * @export get-Block-Hash
 * @param [blockHeight] Number
 * @returns [response]
 */
export const getBlockHash = (_fetch: any, blockHeight: number) => {
  return _fetch('/ctl/getblockhash', blockHeight)
}

/**
 * @export get-BlockHeader-by-Height
 * @param [height] number
 * @returns [response]
 */
export const getBlockHeaderByHeight = (_fetch: any, height: number) => {
  return _fetch('/ctl/getblockheader', height)
}

/**
 * @export get-Block-Header-by-Hash
 * @param [hash] string
 * @returns [response]
 */
export const getBlockHeaderByHash = (_fetch: any, hash: string) => {
  return _fetch('/ctl/getblockheader', hash)
}

/**
 * @export get-Block-Height
 * @param null
 * @returns [response]
 */
export const getBlockHeight = (_fetch: any) => {
  return _fetch('/ctl/getblockheight')
}

/**
 * @export get-Node-Info
 * @param null
 * @returns [response]
 */
export const getNodeInfo = (_fetch: any) => {
  return _fetch('/ctl/getnodeinfo')
}

/**
 * @export view-Block-Detail
 * @param [hash] string
 * @returns [response]
 */
export const viewBlockDetail = (_fetch: any, hash: string) => {
  return _fetch('/block/detail', hash)
}
