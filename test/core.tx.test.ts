import 'jest'
import fetch from 'isomorphic-fetch'
import Mock from '../static/json/mock.json'
import Keystore from '../static/json/keystore.json'
import Api from '../package/boxd/core/api'
import Feature from '../package/boxd/core/feature'
import PrivateKey from '../package/boxd/util/crypto/privatekey'
import BN from 'bn.js'

const api = new Api(fetch, Mock.endpoint_dev, 'http')
const feature = new Feature(fetch, Mock.endpoint_dev, 'http')
const priv_key = new PrivateKey(
  '27119424a9b02b9baeec4f803887d1bb241d70d19031ec6336dc611723708dae'
)
const raw_hash =
  '837ea757f653af567cd181e18b2605a3058ddbad94d4444b7bc43ae2f0404505'

/* const sleep = seconds => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
} */

jest.setTimeout(15000)

test('Get the BOX balances of the given addresses', async () => {
  try {
    expect(await api.getBalances([Mock.addr_4, Mock.addr_4]))
  } catch (err) {
    console.error('Get the BOX balances of the given addresses Error :', err)
    expect(0).toBe(1)
  }
})

test('Sign transaction by privKey || crypto', async () => {
  try {
    const unsigned_tx = await api.makeUnsignedBOXTx({
      from: Mock.addr_4,
      to: Mock.to_addr_list,
      amounts: Mock.amount_list
    })

    const signed_tx = await api.signTxByPrivKey({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      privKey: Mock.privatekey_3,
      protocalTx: null
    })

    const signed_tx_by_crypto = await feature.signTxByCrypto({
      unsignedTx: {
        tx: unsigned_tx.tx,
        rawMsgs: unsigned_tx.rawMsgs
      },
      crypto: Keystore.ks_3,
      pwd: Mock.acc_pwd
    })

    expect(signed_tx).toEqual(signed_tx_by_crypto)
  } catch (err) {
    console.error('Sign transaction by privKey or crypto Error :', err)
    expect(0).toBe(1)
  }
})

test('Sign raw hash', async () => {
  try {
    const raw_hash_buf = new BN(
      '51af0edcf37f287d1b706878502832e542a532a051bd1a89ee5523e5b9de2c80'
    ).toBuffer()
    console.log('[Sign raw hash] raw_hash_buf :', raw_hash_buf)

    const signature = await priv_key.privKey.signMsg(
      Buffer.from(raw_hash, 'hex')
    )
    console.log('[Sign raw hash] signed_signature :', signature.toString('hex'))

    /*TODO const verify_result = await priv_key.privKey.verifyMsg(
      Buffer.from(raw_hash, 'hex'),
      signature,
      pub_key
    )
    console.log('Verify result :', verify_result)
    expect(verify_result) */
  } catch (err) {
    console.error('[Sign raw hash] Error :', err)
    expect(0).toBe(1)
  }
})

test('Make a BOX transaction [Backend Serialization]', async () => {
  try {
    const sent_tx = await feature.makeBoxTxByCryptoUseBoxd({
      tx: {
        from: Mock.addr_3,
        to: Mock.to_addr_list,
        amounts: Mock.amount_list
      },
      crypto: Keystore.ks_3,
      pwd: Mock.acc_pwd
    })

    expect(sent_tx['code']).toBe(0)
    expect(sent_tx.hash)
  } catch (err) {
    console.error('Make a BOX transaction [Backend Serialization] Error :', err)
    expect(0).toBe(1)
  }

  // await sleep(2)
  // done()
})

// test("Make a BOX transaction [Local Serialization]", async () => {
//   try {
//     const tx_result = await feature.makeBoxTxByCrypto({
//       tx: {
//         from: Mock.addr_2,
//         to: Mock.to_addr_list,
//         amounts: Mock.amount_list
//       },
//       crypto: Keystore.ks_3,
//       pwd: Mock.acc_pwd
//     })
//     console.log("tx_result.hash :", tx_result.hash)
//     const tx_detail = await api.viewTxDetail(tx_result.hash)

//     expect(tx_detail.detail.hash).toEqual(tx_result.hash)
//   } catch (err) {
//     console.error("Make a BOX transaction [Local Serialization] Error :", err)
//     expect(0).toBe(1)
//   }
// })

// test("Make a raw transaction (BOX)", async () => {
//   try {
//     const created_tx = await api.createRawTx({
//       addr: Mock.addr_4,
//       to: Mock.to_map,
//       privKey: Mock.privatekey_3
//     })
//     const tx_result = await api.sendTx(created_tx)
//     console.log("tx_result.hash :", tx_result.hash)
//     const tx_detail = await api.viewTxDetail(tx_result.hash)

//     expect(tx_detail.detail.hash).toEqual(tx_result.hash)
//     // Row
//     /*TODO const created_tx_row = await api.createRawTx(
//       {
//         addr: Mock.addr_4,
//         to: Mock.to_map,
//         privKey: Mock.privatekey_3
//       },
//       'is_raw'
//     )
//     expect(created_tx_row)
//     console.log('created_tx_row :', created_tx_row)
//     const sent_tx_row = await api.sendRawTx(created_tx_row)
//     console.log('sent_tx_row :', JSON.stringify(sent_tx_row)) */
//   } catch (err) {
//     console.error("Make a raw transaction Error :", err)
//     expect(0).toBe(1)
//   }
// })
