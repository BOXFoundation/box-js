import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import fetch from 'isomorphic-fetch'
import Data from './json/mock.json'
import Keystore from './json/keystore.json'

const abi = new AbiCoder()

let src = Data.acc_addr_4
let contractAddr

const cor = new Api(fetch, Data.endpoint_test, 'http')
const feature = new Feature(fetch, Data.endpoint_test, 'http')

// const contract = `pragma solidity >=0.4.0 <0.6.0;

// contract SimpleStorage {
//     uint256 balance;

//     constructor() public {
//         balance = 100;
//     }
    
//     function incrementBalance(uint256 x) public {
//         balance += x;
//     }

//     function getBalance() public view returns (uint256) {
//         return balance;
//     }
// }`
const contractByteCode = "608060405234801561001057600080fd5b50606460008190555060ee806100276000396000f3fe6080604052600436106043576000357c01000000000000000000000000000000000000000000000000000000009004806312065fe0146048578063b32fe94f146070575b600080fd5b348015605357600080fd5b50605a60a7565b6040518082815260200191505060405180910390f35b348015607b57600080fd5b5060a560048036036020811015609057600080fd5b810190808035906020019092919050505060b0565b005b60008054905090565b8060008082825401925050819055505056fea165627a7a7230582047166aca4d4049ee228c6e923b8a0ea99001339217422f3f0ca2fac781d5b07f0029"

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

  const tx_result = await feature.makeContractTxByCrypto({
    tx: {
      from: src,
      to: "",
      amount: 0,
      gasPrice: Data.gasPrice,
      gasLimit: Data.gasLimit,
      nonce: addrNonce + 1,
      isDeploy: true,
      data: contractByteCode
    },
    crypto: Keystore.keystore_4,
    pwd: Data.acc_pwd
  })
  console.log("contract deployed at: " + tx_result.contractAddr)
  const tx_detail = await cor.viewTxDetail(tx_result.hash)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  contractAddr = tx_result.contractAddr
  expect(await getBalance()).toEqual(100)
})

// This must be run after deploy
test('Send a contract method', async () => {
  let addrNonce = +(await getNonce())
  let initBalance = await getBalance()
  let depositAmount = 137

  console.log("sending contract @ " + contractAddr + " with balance: " + initBalance)
  const data = await abi.encodeFunctionCall(
    {
      name: 'incrementBalance',
      inputs: [
        {
          type: 'uint256'
        }
      ]
    },
    [depositAmount]
  )

  const tx_result = await feature.makeContractTxByCrypto({
    tx: {
      from: src,
      to: contractAddr,
      amount: 0,
      gasPrice: Data.gasPrice,
      gasLimit: Data.gasLimit,
      nonce: addrNonce + 1,
      isDeploy: false,
      data: data,
    },
    crypto: Keystore.keystore_4,
    pwd: Data.acc_pwd
  })
  const tx_detail = await cor.viewTxDetail(tx_result.hash)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  expect(await getBalance()).toEqual(initBalance + depositAmount)
})

async function getBalance() : Promise<number> {
  const data = await abi.encodeFunctionCall(
    {
      name: 'getBalance',
      inputs: []
    },
    []
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
    'uint256',
    Buffer.from(
      result,
      'hex'
    )
  )
  return decoded
}