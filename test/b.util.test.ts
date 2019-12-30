import 'jest'
import Util from '../package/boxd/util/util'

const boxAddr = 'b1gsjyxh4VUAJdovbWKucgAu8WjNg7bfjYK'

test('Convert between box and hex address', async () => {
  try {
    expect(
      Util.hex2BoxAddr(boxAddr.slice(0, 2), Util.box2HexAddr(boxAddr))
    ).toEqual(boxAddr)
  } catch (err) {
    console.error('Convert between box and hex address Error :', err)
    expect(0).toBe(1)
  }
})
