const { ethers } = require('ethers');
const solc = require('solc');
const fs = require('fs');
require('dotenv').config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log('Deploying from:', wallet.address);

  const source = fs.readFileSync('StablecoinFX.sol', 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'StablecoinFX.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
  };

  console.log('Compiling contract...');
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts['StablecoinFX.sol']['StablecoinFX'];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  console.log('Deploying StablecoinFX...');
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  const deployed = await factory.deploy('Kebs Dollar', 'kUSD', 'USD', 1000000);
  await deployed.waitForDeployment();
  const address = await deployed.getAddress();

  console.log('✅ StablecoinFX deployed to:', address);
  console.log('Explorer: https://testnet.arcscan.app/address/' + address);
}

main().catch(console.error);
