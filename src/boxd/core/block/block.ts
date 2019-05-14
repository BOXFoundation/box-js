import bitcore from 'bitcore-lib'
export class Block {
  block
  constructor(block: bitcore.Block) {
    this.block = new bitcore.Block(block)
  }
}
