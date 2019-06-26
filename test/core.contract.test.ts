import 'jest'
import AbiCoder from '../src/boxd/core/contract/abi/abicoder'
import Account from '../src/boxd/account/account'
import Api from '../src/boxd/core/api'
import Feature from '../src/boxd/core/feature'
import fetch from 'isomorphic-fetch'
import Data from './json/mock.json'
import Keystore from './json/keystore.json'

const abi = new AbiCoder()
const account = new Account()

// base58 format
let src = Data.acc_addr_4
// hex format
const srcHexAddr = account.dumpPubKeyHashFromAddr(src)
const anotherHexAddr = account.dumpPubKeyHashFromAddr(Data.acc_addr_1)
let contractAddr

const cor = new Api(fetch, Data.endpoint_test, 'http')
const feature = new Feature(fetch, Data.endpoint_test, 'http')

// const contract = `pragma solidity >=0.4.0 <0.6.0;

// contract SimpleStorage {
//     uint256 balance;
//     address public minter;

//     constructor() public {
//         balance = 100;
//         minter = msg.sender;
//     }
    
//     function incrementBalance(uint256 x) public {
//         balance += x;
//     }

//     function getBalance() public view returns (uint256) {
//         return balance;
//     }
    
//     function isMinter(address addr) public view returns (bool) {
//         return addr == minter;
//     }
// }
const contractByteCode = "608060405234801561001057600080fd5b50606460008190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061024e806100696000396000f3fe60806040526004361061005c576000357c010000000000000000000000000000000000000000000000000000000090048063075461721461006157806312065fe0146100b8578063aa271e1a146100e3578063b32fe94f1461014c575b600080fd5b34801561006d57600080fd5b50610076610187565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100c457600080fd5b506100cd6101ad565b6040518082815260200191505060405180910390f35b3480156100ef57600080fd5b506101326004803603602081101561010657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506101b6565b604051808215151515815260200191505060405180910390f35b34801561015857600080fd5b506101856004803603602081101561016f57600080fd5b8101908080359060200190929190505050610210565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16149050919050565b8060008082825401925050819055505056fea165627a7a723058205c2c787af632722a11ec1d9c3628e84a206af0b9c8484816ff4504f46666571d0029"

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

// This must be run after deploy
test('Call a contract method', async () => {
  expect(await isMinter(srcHexAddr)).toBe(true)
  expect(await isMinter(anotherHexAddr)).toBe(false)
})

async function isMinter(hexAddr: string | undefined) : Promise<boolean> {
  const data = await abi.encodeFunctionCall(
    {
      name: 'isMinter',
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
    'bool',
    Buffer.from(
      result,
      'hex'
    )
  )
  return decoded
}