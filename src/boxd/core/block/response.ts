namespace Response {
  export interface BlockHeader {
    version: number
    prev_block_hash: string
    txs_root: string
    time_stamp: string
    magic: number
    period_hash: string
    candidates_hash: string
  }

  export interface Block {
    header: BlockHeader
    txs: object[]
    height: number
    signature: string
    irreversible_info: {
      hash: string
      signatures: []
    }
  }

  export interface NodeInfo {
    nodes: {
      id: string
      addrs: string[]
      ttl: string
    }[]
  }
}

export default Response
