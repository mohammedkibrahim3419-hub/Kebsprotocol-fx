const { ethers } = require('ethers');
require('dotenv').config();

const FXSWAP = '0x194CD7bd0BF9987085A114075D35aA9e9fe10Eb1';
const kUSD = '0x0D8E815fDc13c2e02964be946f698488cec68c58';
const kNGN = '0x868b72e3f2fdce8A9C2B1804A543a7C4c905d576';

const ABI = [
  'function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) public view returns (uint256)'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);
  const swap = new ethers.Contract(FXSWAP, ABI, provider);

  // Test: How much kNGN do I get for 1 kUSD?
  const amountOut = await swap.getAmountOut(kUSD, kNGN, 1000000);
  console.log('1 kUSD =', amountOut.toString(), 'kNGN');

  // Test: How much kKES do I get for 1 kUSD?
  const kKES = '0x28d735522b89636334B03DfA60A0783b38038775';
  const amountKES = await swap.getAmountOut(kUSD, kKES, 1000000);
  console.log('1 kUSD =', amountKES.toString(), 'kKES');
}

main().catch(console.error);
