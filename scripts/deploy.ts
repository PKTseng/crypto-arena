import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', ethers.formatEther(balance), 'ETH');

  const Factory  = await ethers.getContractFactory('CryptoArenaBet');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('\n✅ CryptoArenaBet deployed to:', address);
  console.log('\nAdd to your .env.local:');
  console.log(`NEXT_PUBLIC_ARENA_BET_ADDRESS=${address}`);
  console.log('\nView on Sepolia Etherscan:');
  console.log(`https://sepolia.etherscan.io/address/${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
