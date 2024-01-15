const { ethers } = require("ethers");
const {
  NONFUNGIBLE_POSITION_MANAGER_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
} = require("./constants.js");
const { sendTransaction, TransactionState } = require("./providers.js");
const IUniswapV3PoolABI = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");

const {
  computePoolAddress,
  Pool,
  Position,
  DEPLOYER_ADDRESSES,
  NonfungiblePositionManager,
} = require("@pancakeswap/v3-sdk");
const { CurrencyAmount, Percent } = require("@pancakeswap/sdk");

const { CurrentConfig } = require("../config.js");
const { getProvider, getWalletAddress } = require("./providers.js");
// const { Percent, CurrencyAmount } = require("@uniswap/sdk-core");

async function removeLiquidity(positionId) {
  const address = getWalletAddress();
  const provider = getProvider();
  if (!address || !provider) {
    return TransactionState.Failed;
  }

  const positionContract = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  );

  const r = await positionContract.positions(Number(positionId));
  const position = {
    nonce: r[0],
    operator: r[1],
    token0: r[2],
    token1: r[3],
    fee: r[4],
    tickLower: r[5],
    tickUpper: r[6],
    liquidity: r[7],
    feeGrowthInside0LastX128: r[8],
    feeGrowthInside1LastX128: r[9],
    tokensOwed0: r[10],
    tokensOwed1: r[11],
  };

  const token0 = CurrentConfig.tokens.token0;
  const token1 = CurrentConfig.tokens.token1;

  const poolTokens = [token0.wrapped, token1.wrapped, position?.fee];

  // console.log(poolTokens, "poolTokens");

  const poolAddress = await getPoolAddress(
    DEPLOYER_ADDRESSES["56"],
    ...poolTokens
  );

  // console.log(poolAddress, "poolAddress");

  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI.abi,
    provider
  );
  const slot0 = await poolContract.slot0();
  const liquidity = await poolContract.liquidity();

  const [tokenA, tokenB, feeAmount] = poolTokens;
  const [sqrtPriceX96, tick, , , , feeProtocol] = slot0;
  const pool = new Pool(
    tokenA,
    tokenB,
    feeAmount,
    sqrtPriceX96,
    liquidity,
    tick
  );

  const positionSDK = new Position({
    pool,
    liquidity: position.liquidity.toString(),
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
  });
  // console.log(position.tokensOwed0.toString(), "pool");

  const liquidityPercentage = new Percent(100, 100);

  const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
    positionSDK,
    {
      tokenId: positionId.toString(),
      liquidityPercentage,
      slippageTolerance: new Percent(50, 10_000),
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      collectOptions: {
        expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
          CurrentConfig.tokens.token0,
          0
        ),
        expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
          CurrentConfig.tokens.token1,
          0
        ),
        recipient: address,
      },
    }
  );

  const transaction = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
  };

  // console.log(transaction, "transaction");
  await sendTransaction(transaction);
}

async function getPoolAddress(deployerAddress, tokenA, tokenB, fee) {
  const { address: addressA } = tokenA;
  const { address: addressB } = tokenB;
  const key = `${deployerAddress}:${addressA}:${addressB}:${fee.toString()}`;

  const address = {
    key,
    address: computePoolAddress({
      deployerAddress,
      tokenA,
      tokenB,
      fee,
    }),
  };
  return address.address;
}

module.exports = {
  removeLiquidity,
};
