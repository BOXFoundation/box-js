import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import fetch from 'isomorphic-fetch'
import Data from './json/mock.json'
import Keystore from './json/keystore.json'

const abi = new AbiCoder()

let src = Data.acc_addr_4
let contractAddr = 'b5VhoKwo3fo4qnXefZiZgUpa4yEqLwxTtaf'

const cor = new Api(fetch, Data.endpoint_test, 'http')
const feature = new Feature(fetch, Data.endpoint_test, 'http')
const metaCoinContract = "608060405234801561001057600080fd5b506127106000803273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506102e3806100656000396000f3fe608060405234801561001057600080fd5b5060043610610053576000357c01000000000000000000000000000000000000000000000000000000009004806390b98a1114610058578063f8b2cb4f146100be575b600080fd5b6100a46004803603604081101561006e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610116565b604051808215151515815260200191505060405180910390f35b610100600480360360208110156100d457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061026f565b6040518082815260200191505060405180910390f35b6000816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156101675760009050610269565b816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190505b92915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a7230582061e7bbea31d160d05e39cf0a63fec1d576afe9a47b8487b15389aa9a720be5a20029"
// const metaCoinContractAbi = [{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"}]
const hexAddr = 'fD37553e3A6aF45b4106C29ccd2bBd045E5c428C'

async function getNonce() : Promise<number> {
  let addrNonce = 0
  
  await cor.getNonce(src)
  .then(result => {
    addrNonce = result.nonce
  })
  .catch(err => {
    console.error('getNonce err:', err)
    expect(0).toBe(1)
  })

  console.log("nonce: " + addrNonce)
  return addrNonce
}

test('Deploy a contract', async () => {
  let addrNonce = +(await getNonce())
  // return

  const tx_result = await feature.makeContractTxByCrypto({
    tx: {
      from: src,
      to: "",
      amount: Data.amount,
      gasPrice: Data.gasPrice,
      gasLimit: Data.gasLimit,
      nonce: addrNonce + 1,
      isDeploy: true,
      data: metaCoinContract
    },
    crypto: Keystore.keystore_4,
    pwd: Data.acc_pwd
  })
  console.log("contract deployed at: " + tx_result.contractAddr)
  const tx_detail = await cor.viewTxDetail(tx_result.hash)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  contractAddr = tx_result.contractAddr
})

// This must be run after deploy
test('Send a contract method', async () => {
  let addrNonce = +(await getNonce())
  // return
  console.log("sending contract at: " + contractAddr)
  const data = await abi.encodeFunctionCall(
    {
      name: 'sendCoin',
      inputs: [
        {
          type: 'address'
        },
        {
          type: 'uint'
        }
      ]
    },
    [hexAddr, 100]
  )
  // console.log(data)

  const tx_result = await feature.makeContractTxByCrypto({
    tx: {
      from: src,
      to: contractAddr,
      amount: 0,
      gasPrice: Data.gasPrice,
      gasLimit: Data.gasLimit,
      nonce: addrNonce + 1,
      isDeploy: false,
      data: data.substring(2)   // remove '0x' prefix
    },
    crypto: Keystore.keystore_4,
    pwd: Data.acc_pwd
  })
  const tx_detail = await cor.viewTxDetail(tx_result.hash)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
})

// This must be run after deploy
test('Call a contract method', async () => {
  const data = await abi.encodeFunctionCall(
    {
      name: 'getBalance',
      inputs: [
        {
          type: 'address'
        }
      ]
    },
    [hexAddr]
  )

  console.log("calling contract at: " + contractAddr)
  const ret = await feature.callContract({
      from: src,
      to: contractAddr,
      data: data,
      height: 0,
      timeout: 0
  })
  const result = ret.result
  console.log(result)
  const decoded = await abi.decodeParameter(
    'uint',
    result
  )
  expect(decoded).toEqual(100)
})