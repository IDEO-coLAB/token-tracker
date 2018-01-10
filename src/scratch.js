// const processTransactions = (transactions=[]) => {
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
//       // console.log(tx)
//       // console.log('sender === 0x27f706edde3aD952EF647Dd67E24e38CD0803DD6')
//       // console.log(sender === '0x00000000000000000000000027f706edde3ad952ef647dd67e24e38cd0803dd6')
//       // console.log('==============> sent from main contract to', recipient)
//     }

//     if (_.has(balances, recipient)) {
//       balances[recipient] += txAmountByTokenDecimal
//     } else {
//       balances[recipient] = txAmountByTokenDecimal
//     }

//     // console.log('===============================\n\n')

//   })
// }