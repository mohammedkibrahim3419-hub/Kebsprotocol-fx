const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://rpc.testnet.arc.network');

const FXSWAP = '0x194CD7bd0BF9987085A114075D35aA9e9fe10Eb1';
const TOKENS = {
  kUSD: '0x0D8E815fDc13c2e02964be946f698488cec68c58',
  kNGN: '0x868b72e3f2fdce8A9C2B1804A543a7C4c905d576',
  kKES: '0x28d735522b89636334B03DfA60A0783b38038775',
  kZAR: '0xbA6730c5164bE0cDE141F93B22790013EA388E35',
  kINR: '0xb8019153d00dCF971a442eB4594BA8DE7D9a63D4',
  kAED: '0x26E608AD1b7ffB8A3204a417189f2C00Be116387',
  kSAR: '0x778EB68Fe729DE79B0683546257A21F648E1Fe83',
};

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

const SWAP_ABI = [
  'function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) view returns (uint256)'
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = req.url;

  if (url.startsWith('/api/balances/')) {
    const address = url.split('/api/balances/')[1];
    try {
      const balances = {};
      for (const [symbol, addr] of Object.entries(TOKENS)) {
        const contract = new ethers.Contract(addr, ERC20_ABI, provider);
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        balances[symbol] = ethers.formatUnits(balance, decimals);
      }
      res.json(balances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (url.startsWith('/api/quote')) {
    const params = new URLSearchParams(url.split('?')[1]);
    const tokenIn = params.get('tokenIn');
    const tokenOut = params.get('tokenOut');
    const amount = params.get('amount');
    try {
      const swap = new ethers.Contract(FXSWAP, SWAP_ABI, provider);
      const amountIn = ethers.parseUnits(amount, 6);
      const amountOut = await swap.getAmountOut(TOKENS[tokenIn], TOKENS[tokenOut], amountIn);
      res.json({ tokenIn, tokenOut, amountIn: amount, amountOut: ethers.formatUnits(amountOut, 6) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
