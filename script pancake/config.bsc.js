const { FeeAmount } = require('@uniswap/v3-sdk');
const { DAI_TOKEN, USDC_TOKEN } = require('./libs/constants.js')

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
    local: 'https://bsc-dataseed1.ninicoin.io	',
    mainnet: 'https://bsc-dataseed1.ninicoin.io',
  },
  wallet: {
    address: '0x5F09d46800fa4399382d4cd9A5FB56333CfF7004',
    privateKey:
      '3494f772e38fd41dc82ebd393947045d69ca008c9c8ee9566bde0f22a2cd6a4d',
  },
  tokens: {
    token0: USDC_TOKEN,
    token0Amount: 1,
    token1: DAI_TOKEN,
    token1Amount: 2,
    poolFee: FeeAmount.LOW,
    fractionToRemove: 1,
    fractionToAdd: 1,
  },
}

module.exports = { Environment, CurrentConfig}

