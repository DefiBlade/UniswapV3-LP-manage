const { ethers } = require("ethers");
const {
  ERC20_ABI,
  NONFUNGIBLE_POSITION_MANAGER_ABI,
  NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
} = require("./constants.js");
const { sendTransaction, TransactionState } = require("./providers.js");
// const {
//   Pool,
//   Position,
//   nearestUsableTick,
//   NonfungiblePositionManager,
// } = require("@uniswap/v3-sdk");
const {
  Pool,
  Position,
  nearestUsableTick,
  NonfungiblePositionManager,
} = require("@uniswap/v3-sdk");

const { CurrentConfig } = require("../config.js");
const { getPoolInfo } = require("./pool.js");
const { getProvider, getWalletAddress } = require("./providers.js");
const { Percent, CurrencyAmount } = require("@uniswap/sdk-core");
const { fromReadableAmount } = require("./conversion.js");
const JSBI = require("jsbi");

async function addLiquidity(positionId) {
  const address = getWalletAddress();
  const provider = getProvider();
  if (!address || !provider) {
    return TransactionState.Failed;
  }

  const positionToIncreaseBy = await constructPosition(
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      fromReadableAmount(
        CurrentConfig.tokens.token0Amount * CurrentConfig.tokens.fractionToAdd,
        CurrentConfig.tokens.token0.decimals
      )
    ),
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token1,
      fromReadableAmount(
        CurrentConfig.tokens.token1Amount * CurrentConfig.tokens.fractionToAdd,
        CurrentConfig.tokens.token1.decimals
      )
    )
  );

  const addLiquidityOptions = {
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
  };

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    positionToIncreaseBy,
    addLiquidityOptions
  );

  // build transaction
  const transaction = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
  };

  await sendTransaction(transaction);
}

function toHex(bigintIsh) {
  const bigInt = JSBI.BigInt(bigintIsh);
  let hex = bigInt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`;
  }
  return `0x${hex}`;
}

async function removeLiquidity(positionId) {
  const address = getWalletAddress();
  const provider = getProvider();
  if (!address || !provider) {
    return TransactionState.Failed;
  }

  const currentPosition = await constructPosition(
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      fromReadableAmount(
        CurrentConfig.tokens.token0Amount,
        CurrentConfig.tokens.token0.decimals
      )
    ),
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token1,
      fromReadableAmount(
        CurrentConfig.tokens.token1Amount,
        CurrentConfig.tokens.token1.decimals
      )
    )
  );

  const collectOptions = {
    expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      0
    ),
    expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token1,
      0
    ),
    recipient: address,
  };

  const removeLiquidityOptions = {
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
    // percentage of liquidity to remove
    liquidityPercentage: new Percent(50, 100),
    collectOptions,
  };

  console.log(
    removeLiquidityOptions.liquidityPercentage.multiply(
      currentPosition.liquidity
    ).quotient
  );

  // construct a partial position with a percentage of liquidity
  const partialPosition = new Position({
    pool: currentPosition.pool,
    liquidity: removeLiquidityOptions.liquidityPercentage.multiply(
      currentPosition.liquidity
    ).quotient,
    tickLower: currentPosition.tickLower,
    tickUpper: currentPosition.tickUpper,
  });

  const { amount0, amount1 } = partialPosition.burnAmountsWithSlippage(
    removeLiquidityOptions.slippageTolerance
  );

  console.log(amount0, amount1);
  console.log(toHex(amount0), toHex(amount1));

  // // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
    currentPosition,
    removeLiquidityOptions
  );

  // build transaction
  const transaction = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
  };

  return sendTransaction(transaction);
}

async function getPositionIds() {
  const provider = getProvider();
  const address = getWalletAddress();

  if (!provider || !address) {
    throw new Error("No provider available");
  }

  const positionContract = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  );

  // Get number of positions
  const balance = await positionContract.balanceOf(address);

  // Get all positions
  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const tokenOfOwnerByIndex = await positionContract.tokenOfOwnerByIndex(
      address,
      i
    );
    tokenIds.push(tokenOfOwnerByIndex);
  }

  return tokenIds;
}

async function getPositionInfo() {
  const provider = getProvider();
  if (!provider) {
    throw new Error("No provider available");
  }

  const positionContract = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  );

  const position = await positionContract.positions(tokenId);

  return {
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
    liquidity: position.liquidity,
    feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
    feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
    tokensOwed0: position.tokensOwed0,
    tokensOwed1: position.tokensOwed1,
  };
}

async function getTokenTransferApproval(token) {
  const provider = getProvider();
  const address = getWalletAddress();
  if (!provider || !address) {
    console.log("No Provider Found");
    return TransactionState.Failed;
  }

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    );

    const transaction = await tokenContract.populateTransaction.approve(
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      ethers.constants.MaxInt256
    );

    return sendTransaction({
      ...transaction,
      from: address,
    });
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}

async function constructPosition(token0Amount, token1Amount) {
  // get pool info
  const poolInfo = await getPoolInfo();

  // construct pool instance
  const configuredPool = new Pool(
    token0Amount.currency,
    token1Amount.currency,
    3000, // poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  // create position using the maximum liquidity from input amounts

  return Position.fromAmounts({
    pool: configuredPool,
    tickLower:
      nearestUsableTick(poolInfo.tick, configuredPool.tickSpacing) -
      configuredPool.tickSpacing * 1,
    tickUpper:
      nearestUsableTick(poolInfo.tick, configuredPool.tickSpacing) +
      configuredPool.tickSpacing * 1,
    amount0: token0Amount.quotient,
    amount1: token1Amount.quotient,
    useFullPrecision: true,
  });
}

async function mintPosition() {
  const address = getWalletAddress();
  const provider = getProvider();
  if (!address || !provider) {
    return TransactionState.Failed;
  }
  // Give approval to the contract to transfer tokens
  // const tokenInApproval = await getTokenTransferApproval(
  //   CurrentConfig.tokens.token0
  // )
  // const tokenOutApproval = await getTokenTransferApproval(
  //   CurrentConfig.tokens.token1
  // )

  // if (
  //   tokenInApproval !== TransactionState.Sent ||
  //   tokenOutApproval !== TransactionState.Sent
  // ) {
  //   return TransactionState.Failed
  // }

  const positionToMint = await constructPosition(
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      fromReadableAmount(
        CurrentConfig.tokens.token0Amount,
        CurrentConfig.tokens.token0.decimals
      )
    ),
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token1,
      fromReadableAmount(
        CurrentConfig.tokens.token1Amount,
        CurrentConfig.tokens.token1.decimals
      )
    )
  );

  const mintOptions = {
    recipient: address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
  };

  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    positionToMint,
    mintOptions
  );

  // build transaction
  const transaction = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
  };

  await sendTransaction(transaction);
}

module.exports = {
  addLiquidity,
  getPositionIds,
  getPositionInfo,
  getTokenTransferApproval,
  constructPosition,
  mintPosition,
};
