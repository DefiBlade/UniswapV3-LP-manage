const {
  getPositionIds,
  addLiquidity,
  removeLiquidity,
  mintPosition,
} = require("./libs/liquidity");
const { CurrentConfig } = require( './config.js')

const chalk = require("chalk");
const WebSocket = require("ws"); // Require ws package
const snipSubscription = new WebSocket(CurrentConfig.socket);

async function handleAddLP() {
  console.log(chalk.green(`\nPreparing LP add! `));
  const ids = await getPositionIds();
  console.log(ids)
  if (ids.length < 1) {
    mintPosition();
  } else {
    addLiquidity(ids[0]);
  }
}

async function handleRemoveLP() {
  console.log(chalk.green(`\nPreparing LP Remove! `));
  const ids = await getPositionIds();
  if (ids.length < 1) {
    return;
  } else {
    removeLiquidity(ids[0]);
  }
}


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function run() {
  // snipSubscription.on("open", function open() {
  //   console.log(
  //     chalk.green.inverse(`\nWeb Socket connected!\n`) 
  //   );
  //   snipSubscription.on("message", function incoming(data) {
  //     console.log(chalk.red(`\nMessage received! Preparing LP remove ... `));
  //     removeLiquidity();
  //     setTimeout(() => {
  //       handleRemoveLP();
  //     }, getRandomNumber(5000, 10000));
  //   });
  // });

  handleAddLP();
  setTimeout(() => {
    handleRemoveLP();
  }, getRandomNumber(10000, 20000));
}

// setInterval(()=> {
//   console.log('Every 60 second');
//   run();
// },60000)

handleAddLP();

