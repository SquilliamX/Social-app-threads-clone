const networkConfig = {
    31337: {
        name: "localhost",
        taxAddress: "0xed139fAEb82800C77E88e9102977255058fFb65C",
        blockConfirmations: 1,
    },
    11155111: {
        name: "sepolia",
        taxAddress: "0xed139fAEb82800C77E88e9102977255058fFb65C",
        blockConfirmations: 6,
    },
    // Add other network configurations if needed
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
