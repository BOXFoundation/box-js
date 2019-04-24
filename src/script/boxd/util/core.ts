export const opcode = {
  // push value
  OP_PUSH_DATA1: 0x4c, // 76
  OP_PUSH_DATA2: 0x4d, // 77
  OP_PUSH_DATA4: 0x4e, // 78

  // stack ops
  OPDUP: 0x76, // 118

  // crypto
  OPEQUALVERIFY: 0xa9, // 169
  OPHASH160: 0xac, // 172

  // bit logic
  OPCHECKSIG: 0x88, // 136

  // en/de code
  OP_ENCODE: 'hex'
}
