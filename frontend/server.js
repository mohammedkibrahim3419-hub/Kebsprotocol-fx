const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);

const FXSWAP = '0x194CD7bd0BF9987085A114075D35aA9e9fe10Eb1';
const TOKENS = {
  kUSD: '0x0D8E815fDc13c2e02964be946f698488cec68c58',
  kNGN: '0x868b72e3f2fdce8A9C2B1804A543a7C4c905d576',
  kKES: '0x28d735522b89636334B03DfA60A0783b38038775',
  kZAR: '0xbA6730c5164bE0cDE141F93B22790013EA388E35',
  kETB: '0x3412034C23d85Df7524D6fE78251a8418E314F01',
  kINR: '0xb8019153d00dCF971a442eB4594BA8DE7D9a63D4',
  kCNY: '0x750a6E9d94927c977D892E25ED27d0C88dDcE4BE',
  kAED: '0x26E608AD1b7ffB8A3204a417189f2C00Be116387',
  kSAR: '0x778EB68Fe729DE79B0683546257A21F648E1Fe83',
  kTRY: '0x911198466C2f59F6A81b517dA4267A93f00A7adB',
};

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
];

const SWAP_ABI = [
  'function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) view returns (uint256)',
  'event Swap(address indexed from, address indexed to, uint256 amountIn, uint256 amountOut, address user)'
];

// Get all balances
app.get('/api/balances/:address', async (req, res) => {
  try {
    const balances = {};
    for (const [symbol, address] of Object.entries(TOKENS)) {
      const contract = new ethers.Contract(address, ERC20_ABI, provider);
      const balance = await contract.balanceOf(req.params.address);
      const decimals = await contract.decimals();
      balances[symbol] = ethers.formatUnits(balance, decimals);
    }
    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get swap quote
app.get('/api/quote', async (req, res) => {
  try {
    const { tokenIn, tokenOut, amount } = req.query;
    const swap = new ethers.Contract(FXSWAP, SWAP_ABI, provider);
    const tokenInAddr = TOKENS[tokenIn];
    const tokenOutAddr = TOKENS[tokenOut];
    const amountIn = ethers.parseUnits(amount, 6);
    const amountOut = await swap.getAmountOut(tokenInAddr, tokenOutAddr, amountIn);
    res.json({
      tokenIn,
      tokenOut,
      amountIn: amount,
      amountOut: ethers.formatUnits(amountOut, 6)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get token list
app.get('/api/tokens', (req, res) => {
  res.json(Object.keys(TOKENS));
});

app.listen(3000, () => console.log('Server running on port 3000'));
