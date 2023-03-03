import { ethers } from "hardhat";
import hre from 'hardhat';

export async function main( _privateKey: string) {
  await hre.run('print', { message: `Private Key:  ${_privateKey}` });
  const selectedNetwork: string = hre.network.name;
  await hre.run('print', { message: `Deploying to network:  ${selectedNetwork}` });
  const wallet = new ethers.Wallet(_privateKey, ethers.provider); // New wallet with the privateKey passed from CLI as param
  await hre.run('print', { message: `Deploying contract with account: ${wallet.address}` });
  const MULTICALL_FACTORY = await ethers.getContractFactory("Multicall");
  const multicall = await MULTICALL_FACTORY.connect(wallet).deploy();
  await multicall.deployed();
  await hre.run('print', { message: `The multicall contract is deployed to ${multicall.address}` });  
}