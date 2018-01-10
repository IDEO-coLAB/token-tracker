const _ = require('lodash')
const fs = require('fs-extra')
const utils = require('web3-utils')
const abi = require('ethereumjs-abi')

const token = require('./token-inputs')

const DATA_FILE_PATH = `./store/${token.name}-data.json`

const tokenData = fs.readJsonSync(DATA_FILE_PATH)

console.log(tokenData.transactions.length + " transactions\n\n--------")
// console.log(tokenData.transactions[tokenData.transactions.length-1])


let balances = {}


// // This code is gross---no time spent here yet, but you get the idea :)
// const processTransactions = (transactions) => {
//   transactions.forEach((tx) => {
//     let topics = tx.topics
//     let sender = topics[1]
//     let recipient = topics[2]
//     let data = tx.data

//     const txAmountBase10 = parseInt(data, 16)
//     const txAmountByTokenDecimal = Number(txAmountBase10 / Math.pow(10, token.decimals))

//     // console.log(sender)
//     // console.log(recipient)
//     // console.log(data)
//     console.log(txAmountByTokenDecimal)
//     console.log(txAmountBase10)
//     console.log('-----------')
//     console.log(tx)
//     console.log('\n-----------\n\n')

//     if (_.has(balances, sender)) {
//       balances[sender] -= txAmountByTokenDecimal
//     } else {
//       // what to do here
//     }

//     if (_.has(balances, recipient)) {
//       balances[recipient] += txAmountByTokenDecimal
//     } else {
//       balances[recipient] = txAmountByTokenDecimal
//     }

//     // console.log('===============================\n\n')

//   })
// }


// processTransactions(tokenData.transactions)
