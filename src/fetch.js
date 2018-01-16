const _     = require('lodash')
const axios = require('axios')
const fs    = require('fs-extra')
const utils = require('web3-utils')
const token = require('./token-inputs')


const DATA_FILE_PATH = `../store/${token.name}-data.json`


const GET_LOGS_URL = `https://api.etherscan.io/api?module=logs&action=getLogs&`
const GET_LATEST_BLOCK_URL = `https://api.infura.io/v1/jsonrpc/mainnet/eth_blockNumber`
const TX_TOPIC_HASH        = `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`


let CUR_HEAD_BLOCK      = null   // get the latest ethereum block head
const BLOCK_STEP        = 20000  // how many blocks to return per RPC call
const FS_WRITE_INTERVAL = 15     // write txs to the fs at every interval
let FS_WRITE_COUNTER    = 0      // keep track of when to write txs to the fs


// remove and make sure file exists
fs.removeSync(DATA_FILE_PATH)
fs.ensureFileSync(DATA_FILE_PATH)

const initialTokenData = fs.readJsonSync(DATA_FILE_PATH, { throws: false })

// shouldn't this always be null if we are deleting
// the path and recreating it each time?
if (_.isNull(initialTokenData)) {
  const initialJSON = { token: token.name, transactions: [] }
  fs.writeJson(DATA_FILE_PATH, initialJSON)
}


let transactionsCache = []


const storeTransactions = (newTransactions=[]) => {

  transactionsCache = transactionsCache.concat(newTransactions)

  console.log('storing locally')

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

  const params = `fromBlock=${fromBlock}&toBlock=${toBlock}&address=${contractAddress}&topic0=${TX_TOPIC_HASH}`
  const txUrl = `${GET_LOGS_URL}${params}`

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
      else{
        console.log("no txs to store");
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
    // needed to write to json one last time
    let existingTxJSON = fs.readJsonSync(DATA_FILE_PATH, { throws: false });
    existingTxJSON.transactions = transactionsCache;
    fs.writeJsonSync(DATA_FILE_PATH, existingTxJSON);
    console.log(`\n\n------${transactionsCache.length}------\n\ndone!!!`)
  })
  .catch((error) => {
    console.log(`\n\n-------------------\n\n${error}\n\n-----------------\n\n`)
  })
