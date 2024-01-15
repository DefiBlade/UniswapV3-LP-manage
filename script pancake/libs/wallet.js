// This file contains code to easily connect to and get information from a wallet on chain

const { ethers } = require( 'ethers')
const { ERC20_ABI } = require( './constants.js')
const { toReadableAmount } = require( './conversion.js')

async function getCurrencyBalance(
  provider,
  address,
  currency
) {
  // Handle ETH directly
  if (currency.isNative) {
    return ethers.utils.formatEther(await provider.getBalance(address))
  }

  // Get currency otherwise
  const ERC20Contract = new ethers.Contract(
    currency.address,
    ERC20_ABI,
    provider
  )
  const balance = await ERC20Contract.balanceOf(address)
  const decimals = await ERC20Contract.decimals()

  // Format with proper units (approximate)
  return toReadableAmount(balance, decimals).toString()
}

module.exports = { getCurrencyBalance}

