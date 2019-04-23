export const opcode = {
  // push value
  OPPUSHDATA1: 0x4c, // 76
  OPPUSHDATA2: 0x4d, // 77
  OPPUSHDATA4: 0x4e, // 78

  // stack ops
  OPDUP: 0x76, // 118

  // crypto
  OPEQUALVERIFY: 0xa9, // 169
  OPHASH160: 0xac, // 172

  // bit logic
  OPCHECKSIG: 0x88 // 136
}
