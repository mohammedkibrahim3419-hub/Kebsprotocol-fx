const { ethers } = require('ethers');
const solc = require('solc');
const fs = require('fs');
require('dotenv').config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log('Wallet:', wallet.address);

  const source = fs.readFileSync('StablecoinFX.sol', 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'StablecoinFX.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts['StablecoinFX.sol']['StablecoinFX'];
  const factory = new ethers.ContractFactory(contract.abi, contract.evm.bytecode.object, wallet);

  console.log('Deploying kNGN...');
  const deployed = await factory.deploy('Kebs Naira', 'kNGN', 'NGN', 1600000000);
  await deployed.waitForDeployment();
  const address = await deployed.getAddress();
  console.log('kNGN deployed to:', address);
  console.log('Explorer: https://testnet.arcscan.app/address/' + address);
}

main().catch(console.error);
