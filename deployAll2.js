const { ethers } = require('ethers');
const solc = require('solc');
const fs = require('fs');
require('dotenv').config();

async function deploy(name, symbol, currency, rate) {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const source = fs.readFileSync('StablecoinFX.sol', 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'StablecoinFX.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts['StablecoinFX.sol']['StablecoinFX'];
  const factory = new ethers.ContractFactory(contract.abi, contract.evm.bytecode.object, wallet);
  const deployed = await factory.deploy(name, symbol, currency, rate);
  await deployed.waitForDeployment();
  const address = await deployed.getAddress();
  console.log(symbol + ' deployed to: ' + address);
  console.log('Explorer: https://testnet.arcscan.app/address/' + address);
}

async function main() {
  console.log('🌍 Deploying Africa currencies...');
  await deploy('Kebs Rand', 'kZAR', 'ZAR', 18000000);
  await deploy('Kebs Birr', 'kETB', 'ETB', 57000000);
  await deploy('Kebs Tanzanian Shilling', 'kTZS', 'TZS', 2700000000);
  await deploy('Kebs Ugandan Shilling', 'kUGX', 'UGX', 3800000000);
  await deploy('Kebs CFA Franc', 'kXOF', 'XOF', 600000000);
  await deploy('Kebs Moroccan Dirham', 'kMAD', 'MAD', 10000000);

  console.log('🌏 Deploying Asia currencies...');
  await deploy('Kebs Indian Rupee', 'kINR', 'INR', 83000000);
  await deploy('Kebs Chinese Yuan', 'kCNY', 'CNY', 7200000);
  await deploy('Kebs UAE Dirham', 'kAED', 'AED', 3670000);

  console.log('🕌 Deploying Middle East currencies...');
  await deploy('Kebs Saudi Riyal', 'kSAR', 'SAR', 3750000);
  await deploy('Kebs Turkish Lira', 'kTRY', 'TRY', 32000000);
  await deploy('Kebs Qatari Riyal', 'kQAR', 'QAR', 3640000);
  await deploy('Kebs Kuwaiti Dinar', 'kKWD', 'KWD', 307000);
  await deploy('Kebs Bahraini Dinar', 'kBHD', 'BHD', 376000);

  console.log('✅ All currencies deployed!')
}

main().catch(console.error);
