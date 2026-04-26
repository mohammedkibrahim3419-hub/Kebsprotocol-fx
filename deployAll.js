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
  await deploy('Kebs Naira', 'kNGN', 'NGN', 1600000000);
  await deploy('Kebs Shilling', 'kKES', 'KES', 130000000);
  await deploy('Kebs Cedi', 'kGHS', 'GHS', 15000000);
  await deploy('Kebs Euro', 'kEUR', 'EUR', 920000);
}

main().catch(console.error);
