// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's
const { Token } = require('@uniswap/sdk-core');

// Addresses

const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865'
const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364'

// Currencies and Tokens

const USDC_TOKEN = new Token(
  56,
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  18,
  'PancakeSwap Token',
  'Cake'
)

const DAI_TOKEN = new Token(
  56,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'Binance-Peg BSC-USD',
  'BSC-USD'
)

// ABI's

const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

const NONFUNGIBLE_POSITION_MANAGER_ABI = [
  // Read-Only Functions
  'function balanceOf(address _owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
]

module.exports = { POOL_FACTORY_CONTRACT_ADDRESS,NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,USDC_TOKEN,DAI_TOKEN,ERC20_ABI,NONFUNGIBLE_POSITION_MANAGER_ABI }
