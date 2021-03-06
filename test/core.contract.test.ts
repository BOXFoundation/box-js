import 'jest'
import fetch from 'isomorphic-fetch'
import Mock from '../static/json/mock.json'
import Keystore from '../static/json/keystore.json'
import Api from '../package/boxd/core/api'
import Feature from '../package/boxd/core/feature'
import Util from '../package/boxd/util/util'
import Contract from '../package/boxd/core/contract'

// base58 format
let src = Mock.addr_4
let contractAddr
// hex format
const srcHexAddr = Util.box2HexAddr(src)
const anotherHexAddr = Util.box2HexAddr(Mock.addr_1)
const url = Mock.endpoint_dev
const api = new Api(fetch, url, 'http')
const feature = new Feature(fetch, url, 'http')
// set provider and from address for all later instances to use
Contract.setProvider(url, src, Mock.privatekey_4)

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
const contractByteCode =
  '608060405234801561001057600080fd5b50606460008190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061024e806100696000396000f3fe60806040526004361061005c576000357c010000000000000000000000000000000000000000000000000000000090048063075461721461006157806312065fe0146100b8578063aa271e1a146100e3578063b32fe94f1461014c575b600080fd5b34801561006d57600080fd5b50610076610187565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100c457600080fd5b506100cd6101ad565b6040518082815260200191505060405180910390f35b3480156100ef57600080fd5b506101326004803603602081101561010657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506101b6565b604051808215151515815260200191505060405180910390f35b34801561015857600080fd5b506101856004803603602081101561016f57600080fd5b8101908080359060200190929190505050610210565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16149050919050565b8060008082825401925050819055505056fea165627a7a723058205c2c787af632722a11ec1d9c3628e84a206af0b9c8484816ff4504f46666571d0029'
const abiJson = [
  {
    constant: true,
    inputs: [],
    name: 'minter',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getBalance',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'isMinter',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'x',
        type: 'uint256'
      }
    ],
    name: 'incrementBalance',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  }
]

async function getBalance(): Promise<number> {
  var contract = new Contract(abiJson, contractAddr)
  console.log('calling contract at: ' + contractAddr)
  return +(await contract.methods.getBalance().call())
}

async function isMinter(hexAddr: string | undefined): Promise<boolean> {
  var contract = new Contract(abiJson, contractAddr)
  console.log('calling contract at: ' + contractAddr)
  return await contract.methods.isMinter(hexAddr).call()
}

async function getNonce(): Promise<number> {
  let result = await api.getNonce(src)

  console.log('nonce: ' + result.nonce)
  return result.nonce
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

test('Deploy a contract', async () => {
  jest.setTimeout(60000)
  let addrNonce = +(await getNonce())

  const tx_result = await feature.makeContractTxByCrypto({
    tx: {
      from: src,
      to: '',
      amount: 0,
      gasLimit: Mock.gasLimit,
      nonce: addrNonce + 1,
      isDeploy: true,
      data: contractByteCode
    },
    crypto: Keystore.ks_4,
    pwd: Mock.acc_pwd
  })
  await sleep(5000)
  console.log('contract deployed at: ' + tx_result.contractAddr)
  const tx_detail = await api.viewTxDetail(tx_result.hash)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  contractAddr = tx_result.contractAddr
  expect(await getBalance()).toEqual(100)
})

// This must be run after deploy
test('Send a contract method', async () => {
  jest.setTimeout(60000)
  var contract = new Contract(abiJson, contractAddr)

  let initBalance = await getBalance()
  let depositAmount = 137

  console.log(
    'sending contract @ ' + contractAddr + ' with balance: ' + initBalance
  )
  const tx_result = await contract.methods
    .incrementBalance(depositAmount)
    .send()

  await sleep(5000)
  const tx_detail = await api.viewTxDetail(tx_result.hash)
  expect(tx_detail.detail.hash).toEqual(tx_result.hash)
  expect(await getBalance()).toEqual(initBalance + depositAmount)
})

// This must be run after deploy
test('Call a contract method', async () => {
  expect(await isMinter(srcHexAddr)).toBe(true)
  expect(await isMinter(anotherHexAddr)).toBe(false)
})

test('Get logs', async () => {
  const logs = await api.getLogs(Mock.constract_logs_req)
  expect(logs)
  // console.log('logs :', logs)
})
