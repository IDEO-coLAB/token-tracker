// const axios = require('axios')
const utils = require('web3-utils')
const abi = require('ethereumjs-abi')

// const GET_LOGS_URL_BASE = `https://api.infura.io/v1/jsonrpc/mainnet/eth_getLogs?params=`

// const TX_TOPIC_HASH = `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`

// const BLOCK_STEP = 50000

// const CONTRACT = '0x27f706edde3aD952EF647Dd67E24e38CD0803DD6'

// const processTransactions = (transactions=[]) => {
//   console.log(transactions[0])
//   console.log('\n=======================\n')
//   console.log(transactions[1])

//   // transactions.forEach((tx) => {

//   // })
// }


// const getTransactionsForContract = (contractAddress, fromBlock) => {
//   const fromBlockHex = utils.numberToHex(fromBlock)
//   const toBlock = fromBlock + BLOCK_STEP
//   const toBlockHex = utils.numberToHex(toBlock)

//   // console.log('FB:', fromBlock)
//   // console.log('TB:', toBlock)
//   // console.log('\n=======================\n')

//   const paramsObj = [{
//     address: contractAddress,
//     fromBlock: fromBlockHex,
//     toBlock: toBlockHex,
//     topics: [ TX_TOPIC_HASH ],
//   }]

//   const paramsJSON = JSON.stringify(paramsObj)
//   // console.log('paramsJSON: ', paramsJSON, '\n\n===========================\n')

//   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
//   const paramsString = encodeURIComponent(paramsJSON)
//   // console.log('paramsString: ', paramsString, '\n\n===========================\n')

//   const txUrl = `${GET_LOGS_URL_BASE}${paramsString}`
//   // console.log('URL: ', txUrl)

//   axios.get(txUrl)
//     .then(function (response) {
//       const transactions = response.data.result
//       if (transactions && transactions.length) {
//         processTransactions(transactions)
//       }
//     })
//     .catch(function (error) {
//       console.log('ERROR!', error)
//     })
// }



// // getTransactionsForContract(CONTRACT, 3940812)
// getTransactionsForContract(CONTRACT, 4040812)




const foo = utils.isAddress('0x000000000000000000000000d0a6e6c54dbc68db5db3a091b171a77407ff7ccf')
console.log(foo)






