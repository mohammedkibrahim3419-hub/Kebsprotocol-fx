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
  return address;
}

async function main() {
  console.log('Deploying Africa currencies...');
  await deploy('Kebs Rand', 'kZAR', 'ZAR', 18000000);
  await deploy('Kebs Birr', 'kETB', 'ETB', 57000000);
  await deploy('Kebs Tanzanian Shilling', 'kTZS', 'TZS', 2700000000);
  await deploy('Kebs Ugandan Shilling', 'kUGX', 'UGX', 3800000000);
  await deploy('Kebs CFA Franc', 'kXOF', 'XOF', 600000000);
  await deploy('Kebs Moroccan Dirham', 'kMAD', 'MAD', 10000000);

  console.log('Deploying Asia currencies...');
  await deploy('Kebs UAE Dirham', 'kAED', 'AED', 3670000);
  await deploy('Kebs Indian Rupee', 'kINR', 'INR', 83000000);
  await deploy('Kebs Chinese Yuan', 'kCNY', 'CNY', 7200000);
}

main().catch(console.error);
