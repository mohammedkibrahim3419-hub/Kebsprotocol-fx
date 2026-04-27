const { ethers } = require('ethers');
require('dotenv').config();

const FXSWAP = '0x194CD7bd0BF9987085A114075D35aA9e9fe10Eb1';
const kUSD = '0x0D8E815fDc13c2e02964be946f698488cec68c58';
const kZAR = '0xbA6730c5164bE0cDE141F93B22790013EA388E35';
const kETB = '0x3412034C23d85Df7524D6fE78251a8418E314F01';
const kTZS = '0x58Fd4C38DfceAb98B39DC62e1c86D408547F7bF7';
const kUGX = '0x65A54d17a2D5158704dcb97D7F52Eca4757e2c14';
const kXOF = '0xedaa179C66B6eF8a80648CaEF993e6101ef7D393';
const kMAD = '0xf5996A0148ab222775f35c140D9c47AC660fC3c5';
const kINR = '0xb8019153d00dCF971a442eB4594BA8DE7D9a63D4';
const kCNY = '0x750a6E9d94927c977D892E25ED27d0C88dDcE4BE';
const kAED = '0x26E608AD1b7ffB8A3204a417189f2C00Be116387';
const kSAR = '0x778EB68Fe729DE79B0683546257A21F648E1Fe83';
const kTRY = '0x911198466C2f59F6A81b517dA4267A93f00A7adB';
const kQAR = '0x168265dFF4FCa8f719a985B79fa443f2F9dFe924';
const kKWD = '0x9C19DB3c7Bc731A2D336bF34755922f604BA44f2';
const kBHD = '0x4fEB6dD07907B098840b2C79A76f1f1401E18B40';

const ABI = [
  'function setRate(address tokenA, address tokenB, uint256 rate) public',
  'function setTokenSymbol(address token, string memory symbol) public'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const swap = new ethers.Contract(FXSWAP, ABI, wallet);

  console.log('Setting token symbols...');
  const tokens = [
    [kZAR, 'kZAR'], [kETB, 'kETB'], [kTZS, 'kTZS'],
    [kUGX, 'kUGX'], [kXOF, 'kXOF'], [kMAD, 'kMAD'],
    [kINR, 'kINR'], [kCNY, 'kCNY'], [kAED, 'kAED'],
    [kSAR, 'kSAR'], [kTRY, 'kTRY'], [kQAR, 'kQAR'],
    [kKWD, 'kKWD'], [kBHD, 'kBHD']
  ];

  for (const [addr, sym] of tokens) {
    console.log('Setting symbol for', sym);
    await (await swap.setTokenSymbol(ethers.getAddress(addr), sym)).wait();
  }

  console.log('Setting rates vs kUSD...');
  const rates = [
    [kUSD, kZAR, 18000000], [kZAR, kUSD, 55556],
    [kUSD, kETB, 57000000], [kETB, kUSD, 17544],
    [kUSD, kTZS, 2700000000], [kTZS, kUSD, 370],
    [kUSD, kUGX, 3800000000], [kUGX, kUSD, 263],
    [kUSD, kXOF, 600000000], [kXOF, kUSD, 1667],
    [kUSD, kMAD, 10000000], [kMAD, kUSD, 100000],
    [kUSD, kINR, 83000000], [kINR, kUSD, 12048],
    [kUSD, kCNY, 7200000], [kCNY, kUSD, 138889],
    [kUSD, kAED, 3670000], [kAED, kUSD, 272480],
    [kUSD, kSAR, 3750000], [kSAR, kUSD, 266667],
    [kUSD, kTRY, 32000000], [kTRY, kUSD, 31250],
    [kUSD, kQAR, 3640000], [kQAR, kUSD, 274725],
    [kUSD, kKWD, 307000], [kKWD, kUSD, 3257329],
    [kUSD, kBHD, 376000], [kBHD, kUSD, 2659574]
  ];

  for (const [tokenA, tokenB, rate] of rates) {
    console.log('Setting rate', rate);
    await (await swap.setRate(ethers.getAddress(tokenA), ethers.getAddress(tokenB), rate)).wait();
  }

  console.log('✅ All rates set successfully!');
}

main().catch(console.error);
