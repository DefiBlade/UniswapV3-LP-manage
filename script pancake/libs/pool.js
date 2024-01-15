const { ethers } = require('ethers')
const { CurrentConfig } = require( '../config.js')
const IUniswapV3PoolABI = require( '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json');
const { POOL_FACTORY_CONTRACT_ADDRESS } = require( './constants.js')
const { getProvider } = require( './providers.js')
const { computePoolAddress } = require( '@uniswap/v3-sdk')

async function getPoolInfo(){
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }

  const currentPoolAddress = "0x7f51c8AaA6B0599aBd16674e2b17FEc7a9f674A1";
  
  // computePoolAddress({
  //   factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
  //   tokenA: CurrentConfig.tokens.token0,
  //   tokenB: CurrentConfig.tokens.token1,
  //   fee: CurrentConfig.tokens.poolFee,
  // })



  console.log(currentPoolAddress)

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  )

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ])

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}

module.exports = { getPoolInfo }


