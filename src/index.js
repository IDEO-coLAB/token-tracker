const _ = require('lodash')
const axios = require('axios')
const utils = require('web3-utils')
const abi = require('ethereumjs-abi')

const GET_LOGS_URL_BASE = `https://api.infura.io/v1/jsonrpc/mainnet/eth_getLogs?params=`

const TX_TOPIC_HASH = `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`

const BLOCK_STEP = 50000

// const CONTRACT = '0xB20BB2780A6Ae9e399e805CE4F60321245F7a0DB' // worked!
const CONTRACT = '0x6dC896e52DeF34fF23Ab0B07250e12B9Fd9fe9E7'

// const DECIMALS = 0 // worked!
const DECIMALS = 18

let txLog = []
let balances = {}


const processTransactions = (transactions=[]) => {
  transactions.forEach((tx) => {
    let topics = tx.topics
    let sender = topics[1]
    let recipient = topics[2]
    let data = tx.data

    const txAmountBase10 = parseInt(data, 16)
    const txAmountByTokenDecimal = Number(txAmountBase10 / Math.pow(10, DECIMALS))

    // console.log(sender)
    // console.log(recipient)
    // console.log(data)
    // console.log(txAmountBase10)
    // console.log(txAmountByTokenDecimal)
    // console.log('\n-----------')

    if (_.has(balances, sender)) {
      balances[sender] -= txAmountByTokenDecimal
    } else {
      // console.log(tx)
      // console.log('sender === 0x27f706edde3aD952EF647Dd67E24e38CD0803DD6')
      // console.log(sender === '0x00000000000000000000000027f706edde3ad952ef647dd67e24e38cd0803dd6')
      // console.log('==============> sent from main contract to', recipient)
    }

    if (_.has(balances, recipient)) {
      balances[recipient] += txAmountByTokenDecimal
    } else {
      balances[recipient] = txAmountByTokenDecimal
    }

    // console.log('===============================\n\n')

  })
}


// const maxFetchCount = 50
// let count = 0

const getTransactionsForContract = (contractAddress, fromBlock) => {
  const fromBlockHex = utils.numberToHex(fromBlock)
  const toBlock = fromBlock + BLOCK_STEP
  const toBlockHex = utils.numberToHex(toBlock)

  // console.log('FB:', fromBlock)
  // console.log('TB:', toBlock)
  // console.log('\n=======================\n')

  const paramsObj = [{
    address: contractAddress,
    fromBlock: fromBlockHex,
    toBlock: toBlockHex,
    topics: [ TX_TOPIC_HASH ],
  }]

  const paramsJSON = JSON.stringify(paramsObj)
  // console.log('paramsJSON: ', paramsJSON, '\n\n===========================\n')
  // console.log('to: ', toBlock, 'from: ', fromBlock, '\n\n===========================\n')

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  const paramsString = encodeURIComponent(paramsJSON)
  // console.log('paramsString: ', paramsString, '\n\n===========================\n')

  const txUrl = `${GET_LOGS_URL_BASE}${paramsString}`
  // console.log('URL: ', txUrl)

  axios.get(txUrl)
    .then(function (response) {
      // count++
      const transactions = response.data.result
      // console.log(transactions)
      if (transactions && transactions.length) {
        processTransactions(transactions)
      }
      if (toBlock+1 <= 4877293) {
        console.log('NEW FETCH: ', toBlock+1)
        return getTransactionsForContract(contractAddress, toBlock+1)
      } else {
        console.log('\n\n\n\n-------------------------------\n\n\n\n')
        let newBals = {}
        for (bal in balances) {
          if (balances[bal] > 0) newBals[bal] = balances[bal]
        }
        console.log(newBals)
        console.log('\n\n\n\n-------------------------------\n\n\n\n')
        console.log(Object.keys(newBals).length, 'total token holders')
      }
    })
    .catch(function (error) {
      console.log('ERROR!', error)
    })
}

getTransactionsForContract(CONTRACT, 2980650)
