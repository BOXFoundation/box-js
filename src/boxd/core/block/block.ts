// const OP_CODE_TYPE = 'hex'

/**
 * @export add-Node
 * @param [*nodeId] string
 * @returns [response]
 */
export const addNode = (_fetch: any, nodeId: string) => {
  return _fetch('/ctl/addnode', nodeId)
}

/**
 * @export get-Block
 * @param [height] Number
 * @param [blockHash] String
 * @returns [response]
 */
export const getBlock = (_fetch: any, param: Number | String) => {
  return _fetch('/ctl/getblock', param)
}

/**
 * @export get-Block-Hash
 * @param [blockHeight] Number
 * @returns [response]
 */
export const getBlockHash = (_fetch: any, blockHeight: Number) => {
  return _fetch('/ctl/getblockhash', blockHeight)
}

/**
 * @export get-Block-Header
 * @param [height] Number
 * @param [hash] String
 * @returns [response]
 */
export const getBlockHeader = (_fetch: any, param: Number | String) => {
  return _fetch('/ctl/getblockheader', param)
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
