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

  export interface IrreversibleInfo {
    hash: string
    signatures: []
  }

  export interface Block {
    header: BlockHeader
    txs: object[]
    height: number
    signature: string
    irreversible_info: IrreversibleInfo
  }
}

export default Response
