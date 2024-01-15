import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { DAI_TOKEN, USDC_TOKEN } from './libs/constants'

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  WALLET_EXTENSION,
  MAINNET,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  env: Environment
  rpc: {
    local: string
    mainnet: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    token0: Token
    token0Amount: number
    token1: Token
    token1Amount: number
    poolFee: FeeAmount
    fractionToRemove: number
    fractionToAdd: number
  }
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  env: Environment.LOCAL,
  rpc: {
    local: 'https://ethereum-goerli.publicnode.com',
    mainnet: 'https://ethereum-goerli.publicnode.com',
  },
  wallet: {
    address: '0x5F09d46800fa4399382d4cd9A5FB56333CfF7004',
    privateKey:
      '3494f772e38fd41dc82ebd393947045d69ca008c9c8ee9566bde0f22a2cd6a4d',
  },
  tokens: {
    token0: USDC_TOKEN,
    token0Amount: 8,
    token1: DAI_TOKEN,
    token1Amount: 16,
    poolFee: FeeAmount.LOW,
    fractionToRemove: 1,
    fractionToAdd: 0.5,
  },
}
