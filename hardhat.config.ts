import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig, task, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const lazyImport = async (module: any) => {
  return await import(module);
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      {
        version: "0.8.16",
      },
    ],
  },
  networks: {
    // Goerli Testnet
    goerli: {
      url: process.env.INFURA_GOERLI_URL || "",
      chainId: 5,
      accounts: [
      ],
    },
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL || "",
      chainId: 11155111,
      accounts: [
      ],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at <https://etherscan.io/>
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  }
};



task("deploy-with-pk", "Deploys contract with pk")
  .addParam("privateKey", "Please provide the private key")
  .setAction(async ({ privateKey}) => {
    const { main } = await lazyImport("./scripts/deploy-multicall");
    await main(privateKey);
  });  

task("deploy-multicall2-with-pk", "Deploys Multicall2 contract with pk")
  .addParam("privateKey", "Please provide the private key")
  .setAction(async ({ privateKey}) => {
    const { main } = await lazyImport("./scripts/deploy-multicall-2");
    await main(privateKey);
  });    
 
subtask("print", "Prints a message")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message);
  });  

export default config;
