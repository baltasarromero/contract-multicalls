
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const Multicall2Artifact = require("../artifacts/contracts/Multicall2.sol/Multicall2.json");
const ERC20Artifact = require("../abis/ERC20.json");

import { BigNumber, Contract, Wallet, } from "ethers";
import { Interface } from "@ethersproject/abi";
import { InfuraProvider } from "@ethersproject/providers";
import { ethers } from "hardhat";

const interactionWithMulticall = async function () {    
    const provider: InfuraProvider = new InfuraProvider("sepolia", process.env.INFURA_PROJECT_ID);

    const wallet1: Wallet = new Wallet(
        process.env.SEPOLIA_WALLET_ACCOUNT_2 || "",
        provider
    );

    // Array for the prepared encoded inputs
    let inputs: any[] = [];

    // Array for the decoded results with the balance of each token 
    const outputs = [];

    const tokenAddresses = ['0x1AAA571fcBAc802e76CD88942395D9D0171212B3', '0x5EeA5bC9f3c1F63136B7a194E0aaA6246043c2CB'];

    // Instantiate the Multicall contract with address, ABI and signer/provider:
    const multicall2Contract =  new Contract( process.env.SEPOLIA_MULTICALL2_ADDRESS || "", 
                    Multicall2Artifact.abi, 
                    provider);

    // Get the interface of the contract that you want to perform multicall to:
    // In our case this is ERC20 contract:
    const tokenInterface = new Interface(ERC20Artifact.abi);

    //Get the function signature/fragment:
    const fragment_balance = tokenInterface.getFunction('balanceOf');

    let result;

    // Iterate over the address of the tokens and encode the function call with the signature of the function and input param that it receives:
    // In our case the 'balanceOf' receives address as input param and we need to pass it:
    tokenAddresses.forEach(tokenAddress => {
        inputs.push({ target: tokenAddress, callData: tokenInterface.encodeFunctionData(fragment_balance, [wallet1.address]) });    
    });

    // We are passing the inputs array with the prepared calls that will be executed through the Multicall contract and iterated on the blockchain withing the smart contract.
    try {
        result = await multicall2Contract.callStatic.tryBlockAndAggregate(false, inputs);
    } catch(e) {
        console.log(e)
    }

    // The result returned but the upper function tryBlockAndAggregate needs to be itterated and decoded the same as it was encoded - with the function fragment
    // The result array contains elements with returnData property. The balance is again in returnData property.
    // The balance is extracted and pushed to the outputs array:
    for ( let index = 0; index < result.returnData.length; index++) {
        const balance = tokenInterface.decodeFunctionResult(fragment_balance, result.returnData[index].returnData);
        outputs.push(balance);
        let tokenAddress = inputs[index].target;
        let formattedBalance = (ethers.utils.formatEther(outputs[index].toString()));

        console.log(`Token address: ${tokenAddress}  balance: ${formattedBalance} `);
    }
};    


interactionWithMulticall();