import 'jest'
import Util from '../src/boxd/util/util'

test('Convert between box and hex address', async () => {
  try {
    const boxAddr = 'b1gsjyxh4VUAJdovbWKucgAu8WjNg7bfjYK'
    const hexAddr = Util.box2HexAddr(boxAddr)
    expect(Util.hex2BoxAddr(boxAddr.slice(0, 2), hexAddr)).toEqual(boxAddr)
  } catch (err) {
    console.error('Convert between box and hex address Error :', err)
    expect(0).toBe(1)
  }
})
