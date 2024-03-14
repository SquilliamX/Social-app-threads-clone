This Project is still under-development.

This is the back-end solidity for Peoples-Voice, a web-3 application, where users can post bounties for independent contractors to pick up and complete. Bounties are crowd-funded by real users for independent contractors/ondemand workers to complete. Once completed, the bounty hunter can upload a video of him/her completeing the bounty and they will get paid from the funds locked in the bounty. All funds are handled by the smart contract to provide a decentrailzed approach.

Users can post any bounty they want as long as they are legal.

Bounties can include:
Reporting: So many reporters are bought out or corrupt, by allowing anyone to ask for any video coverage on any topic, we can decentralize media & journalism.

    Product Funding DAOs: Say users have a great idea for a product or company, by uploading a bounty, a user can keep a 5% ownership in the TVL, while bounty hunters can develop the product or service and get paid from the funds in the bounty.

    and more!

    People's Voice DAO is essential to human society becuase now Users around the world can ask for anything, and if there is common interest for the bounty to be completed, then bounty hunters are incentivized to complete the job.

    Society now has a way to crowdfund, ask, and push for any objectives that they want to see built in the world, and we can all work together to build a better future for human civilization.


## Getting Started


TO use this:

1. Change files in .env to your files.

2. run "yarn compile" to get the abi and bytecode/bin
    yarn compile has been added as a script in package.json:
        "scripts": {
         "compile": "yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . contracts/PeoplesVoice.sol"
        }

3. run `yarn hardhat node` - starts a local Ethereum network using Hardhat.
