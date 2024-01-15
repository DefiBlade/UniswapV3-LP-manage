const {
  getPositionIds,
  addLiquidity,
  mintPosition,
} = require("./libs/liquidity");
const { removeLiquidity } = require("./libs/removeLiquidity");
const { CurrentConfig } = require("./config.js");

const chalk = require("chalk");
const WebSocket = require("ws"); // Require ws package
const snipSubscription = new WebSocket(CurrentConfig.socket);
var isRunning = false;

async function handleAddLP() {
  isRunning = true;
  console.log(chalk.green(`\nPreparing LP add! `));
  const ids = await getPositionIds();
  console.log(ids);
  if (ids.length < 1) {
    await mintPosition();
  } else {
    await addLiquidity(ids[0]);
  }
  isRunning = false;
}

async function handleRemoveLP() {
  isRunning = true;
  console.log(chalk.green(`\nPreparing LP Remove! `));
  const ids = await getPositionIds();
  if (ids.length < 1) {
    return;
  } else {
    await removeLiquidity(ids[0]);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function run() {
  snipSubscription.on("open", function open() {
    console.log(chalk.green.inverse(`\nWeb Socket connected!\n`));
    snipSubscription.on("message", async function incoming(data) {
      console.log(chalk.red(`\nMessage received! ... `));
      if (!isRunning) {
        await handleRemoveLP();
        setTimeout(async () => {
         await handleAddLP();
        }, getRandomNumber(5000, 10000));
      }
    });
  });
  handleAddLP();
}

run();
