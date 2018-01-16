const _     = require('lodash')
const fs    = require('fs-extra')
const Web3  = require('web3');
const token = require('./token-inputs')


const web3 = new Web3();


const DATA_FILE_PATH = `../store/${token.name}-data.json`
const tokenData = fs.readJsonSync(DATA_FILE_PATH)


// quick check --
console.log(tokenData.transactions.length + " transactions\n\n--------")



let balances = {}
const processTransactions = (transactions) => {
  transactions.forEach((tx) => {
    let data      = tx.data
    let topics    = tx.topics;
    let sender    = web3.eth.abi.decodeParameter('address', topics[1]);
    let recipient = web3.eth.abi.decodeParameter('address', topics[2]);

    const txAmountBase10 = parseInt(data, 16)
    const txAmountByTokenDecimal = Number(txAmountBase10 / Math.pow(10, token.decimals))

    if (_.has(balances, sender)) {
      balances[sender] -= txAmountByTokenDecimal
    } else {
      // what to do here... seems to be origin point of tokens?
      console.log(sender);
    }
    if (_.has(balances, recipient)) {
      balances[recipient] += txAmountByTokenDecimal
    } else {
      balances[recipient] = txAmountByTokenDecimal
    }
  })
}



processTransactions(tokenData.transactions)
