var Contract = require('../src/boxd/core/contract/index')
 
// set provider and private key for all later instances to use
Contract.setProvider('http://127.0.0.1:19110', '0fb5104cbf4814dbd5ae3855d6168ceb255f079b9a86bfcd56b965d9d478441b')

let abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "minter",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x07546172"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "uint256"
        }
      ],
      "name": "incrementBalance",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xb32fe94f"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x12065fe0"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "isMinter",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xaa271e1a"
    }
  ]

var contract = new Contract(abi, 'b5YEZsnSoBwENVMUSviujqBd6zi3HFJV64D');

(async () => {

  // const ret = await contract.methods.incrementBalance(1).send()

  let ret = await contract.methods.getBalance().call()
  console.log(ret)

})()
