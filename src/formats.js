// RPC Params object before url formatting
// ----------------------------------
// [
//   {
//     "address":"0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b",
//     "fromBlock":"earliest",
//     "toBlock":"0x186A0",
//     "topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
//   }
// ]

// Transaction Event format
// ----------------------------------
// {
//   "address":"0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0",
//   "topics":[
//     "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//     "0x000000000000000000000000d0a6e6c54dbc68db5db3a091b171a77407ff7ccf",
//     "0x000000000000000000000000ba809aeb7f910d44ece7f1f17af99b489d010ffc"
//   ],
//   "data":"0x00000000000000000000000000000000000000000000002143420340dabfb0de",
//   "blockNumber":"0x3c64e8",
//   "timeStamp":"0x5957a583",
//   "gasPrice":"0x4e3b29200",
//   "gasUsed":"0x143ae",
//   "logIndex":"0x23",
//   "transactionHash":"0x08135795a5c917b6eff494f5778f6b33e810fe6ed3646799a36d835aa3f94c64",
//   "transactionIndex":"0x1b"
// }


const foo = utils.hexToNumberString('0x0000000000000000000000000000000000000000000000008c2a687ce7720000')
console.log(Number(foo))

const balances = {}

(tx) => {

}
