// This file stores web3 related constants such as addresses, token definitions, ETH currency references and ABI's
const { Token } = require('@uniswap/sdk-core');

// Addresses

const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

// Currencies and Tokens

const USDC_TOKEN = new Token(
  5,
  '0x5b1b20323831A83681676BcEfe51fBac29c5A148',
  18,
  'Lp1',
  'L1'
)

const DAI_TOKEN = new Token(
  5,
  '0x6d39A2dD91990E443f3f7feCB8233F2185610a1d',
  18,
  'Lp2',
  'L2'
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
