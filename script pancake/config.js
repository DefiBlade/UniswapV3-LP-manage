const { FeeAmount } = require('@uniswap/v3-sdk');
const { CAKE_TOKEN, USDT_TOKEN } = require('./libs/constants.js')

// Sets if the example should run locally or on chain

const Environment = {
  LOCAL: 0,
  WALLET_EXTENSION: 1,
  MAINNET: 2
};

// Example Configuration

const CurrentConfig = {
  env: Environment.LOCAL,
  socket: "wss://api.mempoolnode.com/ws?apiKey=6024c1fa-8f4b-44a7-b898-651c0dad9eac",
  rpc: {
    local: 'https://bsc-dataseed2.defibit.io',
    mainnet: 'https://bsc-dataseed2.defibit.io',
  },
  wallet: {
    address: '0x5F09d46800fa4399382d4cd9A5FB56333CfF7004',
    privateKey:
      '3494f772e38fd41dc82ebd393947045d69ca008c9c8ee9566bde0f22a2cd6a4d',
  },
  tokens: {
    token0: CAKE_TOKEN,
    token0Amount: 1,
    token1: USDT_TOKEN,
    token1Amount: 1,
    poolFee: FeeAmount.LOW,
    fractionToRemove: 1,
    fractionToAdd: 1,
  },
}

module.exports = { Environment, CurrentConfig}

