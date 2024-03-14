const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    console.log("----------------------------------------------------")
    console.log("Deploying PeoplesVoice contract...")
    console.log("Network:", network.name)
    console.log("Chain ID:", chainId)
    console.log("Deployer:", deployer)

    // Get the contract factory
    const PeoplesVoiceFactory = await ethers.getContractFactory("PeoplesVoice")

    // Deploy the contract
    console.log("Deploying contract...")
    const peoplesVoice = await PeoplesVoiceFactory.deploy()
    await peoplesVoice.deployed()

    console.log("PeoplesVoice contract deployed at:", peoplesVoice.address)

    // Wait for a few blocks confirmation
    if (network.config.blockConfirmations > 1) {
        console.log(`Waiting for ${network.config.blockConfirmations} block confirmations...`)
        await peoplesVoice.deployTransaction.wait(network.config.blockConfirmations)
    }

    // Print the contract address
    console.log("PeoplesVoice contract address:", peoplesVoice.address)

    // Print the deployer balance
    const deployerBalance = await ethers.provider.getBalance(deployer)
    console.log(
        "Deployer balance after deployment:",
        ethers.utils.formatEther(deployerBalance),
        "ETH",
    )

    // Verify the contract on Etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying contract...")
        await verify(peoplesVoice.address, [])
        console.log("Contract verified on Etherscan")
    }

    console.log("----------------------------------------------------")
}

module.exports.tags = ["all", "peoplesvoice"]
