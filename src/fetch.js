const _ = require('lodash')
const axios = require('axios')
const fs = require('fs-extra')
const utils = require('web3-utils')

const token = require('./token-inputs')

const DATA_FILE_PATH = `./store/${token.name}-data.json`


// const GET_LOGS_URL = `https://api.infura.io/v1/jsonrpc/mainnet/eth_getLogs?params=`
const GET_LOGS_URL = `https://api.etherscan.io/api?module=logs&action=getLogs&`


const GET_LATEST_BLOCK_URL = `https://api.infura.io/v1/jsonrpc/mainnet/eth_blockNumber`
const TX_TOPIC_HASH = `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`

let CUR_HEAD_BLOCK = null // get the latest ethereum block head

const BLOCK_STEP = 20000 // how many blocks to return per RPC call
const FS_WRITE_INTERVAL = 15 // write txs to the fs at every interval
let FS_WRITE_COUNTER = 0 // keep track of when to write txs to the fs




fs.removeSync(DATA_FILE_PATH)



// ensure the data file exists
fs.ensureFileSync(DATA_FILE_PATH)

const initialTokenData = fs.readJsonSync(DATA_FILE_PATH, { throws: false })

if (_.isNull(initialTokenData)) {
  const initialJSON = { token: token.name, transactions: [] }
  fs.writeJson(DATA_FILE_PATH, initialJSON)
}


let transactionsCache = []


const storeTransactions = (newTransactions=[]) => {

  transactionsCache = transactionsCache.concat(newTransactions)

  console.log('storing locally')

  // //////////////////////////
  // //////////////////////////
  // //////////////////////////
  // HEY MICHAEL - this is what you'll want to uncomment to
  // write to the fs and build a registry; may have a bug or
  // two, but was working generally yesterday before the
  // non-determinism issues. I'll clean this code up, but it
  // should be close to working
  // //////////////////////////
  // //////////////////////////
  // //////////////////////////

  // write the latest transactions to the fs
  // at a specified interval
  FS_WRITE_COUNTER++
  if ((FS_WRITE_COUNTER % FS_WRITE_INTERVAL) === 0) {
    let existingTxJSON = fs.readJsonSync(DATA_FILE_PATH, { throws: false })
    existingTxJSON.transactions = transactionsCache
    console.log(existingTxJSON.transactions.length, 'indexed transactions')
    fs.writeJsonSync(DATA_FILE_PATH, existingTxJSON)
  }
}




const getTransactionsForContract = (contractAddress, fromBlock) => {
  const fromBlockHex = utils.numberToHex(fromBlock)
  const toBlock = fromBlock + BLOCK_STEP
  const toBlockHex = utils.numberToHex(toBlock)

  console.log('Fetching', fromBlock, ' to ', toBlock)

  // const paramsObj = [{
  //   address: contractAddress,
  //   fromBlock: fromBlockHex,
  //   toBlock: toBlockHex,
  //   topics: [ TX_TOPIC_HASH ],
  // }]
  const params = `fromBlock=${fromBlock}&toBlock=${toBlock}&address=${contractAddress}&topic0=${TX_TOPIC_HASH}`
  const txUrl = `${GET_LOGS_URL}${params}`

  // console.log(txUrl)

  // const paramsJSON = JSON.stringify(paramsObj)
  // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  // const paramsString = encodeURIComponent(paramsJSON)
  // const txUrl = `${GET_LOGS_URL}${paramsString}`

  return axios.get(txUrl)
    .then(function (response) {
      const transactions = response.data.result

      if (_.size(transactions)) {
        storeTransactions(transactions)
      }

      const nextFetchBlock = toBlock+1
      if (nextFetchBlock <= CUR_HEAD_BLOCK) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(getTransactionsForContract(contractAddress, nextFetchBlock))
          }, 450)
        })
        // return getTransactionsForContract(contractAddress, nextFetchBlock)
      }
    })
}



const getLatestBlock = () => {
  return axios.get(GET_LATEST_BLOCK_URL)
    .then(function (response) {
      const curHeadBlockHex = response.data.result
      CUR_HEAD_BLOCK = parseInt(curHeadBlockHex, 16)
      console.log('CUR_HEAD_BLOCK: ', CUR_HEAD_BLOCK)
    })
}



getLatestBlock()
  .then(() => getTransactionsForContract(token.contract, token.genesisBlock))
  .then(() => {
    // console.log(`${JSON.stringify(transactionsCache, null, 4)}`)
    console.log(`${JSON.stringify(transactionsCache[0], null, 4)}`)
    console.log(`${JSON.stringify(transactionsCache[transactionsCache.length-1], null, 4)}`)
    console.log(`\n\n------${transactionsCache.length}------\n\ndone!!!`)
    // console.log(`------------------------------------------`)
    // console.log(`${JSON.stringify(transactionsCache[transactionsCache.length-1])}`)
  })
  .catch((error) => {
    console.log(`\n\n-------------------\n\n${error}\n\n-----------------\n\n`)
  })

