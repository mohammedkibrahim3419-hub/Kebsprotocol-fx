const { ethers } = require('ethers');
require('dotenv').config();

const FXSWAP = '0x194CD7bd0BF9987085A114075D35aA9e9fe10Eb1';
const kUSD = '0x0D8E815fDc13c2e02964be946f698488cec68c58';
const kNGN = '0x868b72e3f2fdce8A9C2B1804A543a7C4c905d576';
const kKES = '0x28d735522b89636334B03DfA60A0783b38038775';

const ABI = [
  'function setRate(address tokenA, address tokenB, uint256 rate) public',
  'function setTokenSymbol(address token, string memory symbol) public'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const swap = new ethers.Contract(FXSWAP, ABI, wallet);

  console.log('Setting token symbols...');
  await (await swap.setTokenSymbol(kUSD, 'kUSD')).wait();
  await (await swap.setTokenSymbol(kNGN, 'kNGN')).wait();
  await (await swap.setTokenSymbol(kKES, 'kKES')).wait();

  console.log('Setting exchange rates...');
  // 1 kUSD = 1600 kNGN
  await (await swap.setRate(kUSD, kNGN, 1600000000)).wait();
  // 1 kNGN = 0.000625 kUSD
  await (await swap.setRate(kNGN, kUSD, 625)).wait();
  // 1 kUSD = 130 kKES
  await (await swap.setRate(kUSD, kKES, 130000000)).wait();
  // 1 kKES = 0.0077 kUSD
  await (await swap.setRate(kKES, kUSD, 7700)).wait();
  // 1 kNGN = 0.08 kKES
  await (await swap.setRate(kNGN, kKES, 81250)).wait();
  // 1 kKES = 12.3 kNGN
  await (await swap.setRate(kKES, kNGN, 12300000)).wait();

  console.log('✅ All rates set!');
  console.log('FXSwap ready at: https://testnet.arcscan.app/address/' + FXSWAP);
}

main().catch(console.error);
