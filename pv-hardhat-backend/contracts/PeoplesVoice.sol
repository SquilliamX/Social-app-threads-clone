// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract PeoplesVoice {
    uint256 public constant CREATION_FEE_ETH = 0.02 ether; // Fee to create a post
    uint256 public constant MIN_UPVOTE_ETH = 0.01 ether; // Minimum upvote fee
    address public constant TAX_ADDRESS = 0xed139fAEb82800C77E88e9102977255058fFb65C;

    struct Bounty {
        uint256 id;
        string content;
        address author;
        uint256 upvoteCount;
        uint256 funds;
        uint256 sharePrice;
        mapping(address => uint256) shareholders;
        address[] shareholderList;
        bool withdrawn; // To track if author has withdrawn their 5%
    }

    uint256 public nextBountyId;
    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => mapping(address => bool)) public hasUpvoted;

    event BountyCreated(uint256 indexed id, string content, address indexed author);
    event BountyUpvoted(uint256 indexed id, address indexed upvoter, uint256 shares);
    event SharesSold(uint256 indexed id, address indexed seller, uint256 amount);
    event FundsWithdrawn(uint256 indexed id, uint256 amount);

    constructor() {}

    function createBounty(string memory _content) public payable {
        require(msg.value >= CREATION_FEE_ETH, "Minimum 0.02 ETH for creating a post");

        uint256 bountyId = nextBountyId++;
        Bounty storage newBounty = bounties[bountyId];
        newBounty.id = bountyId;
        newBounty.content = _content;
        newBounty.author = msg.sender;
        newBounty.funds = msg.value - CREATION_FEE_ETH; // Deduct the creation fee
        newBounty.sharePrice = CREATION_FEE_ETH; // Initial share price is the creation fee
        newBounty.shareholderList.push(msg.sender);
        newBounty.shareholders[msg.sender] = msg.value / newBounty.sharePrice; // Assign initial shares based on payment
        newBounty.withdrawn = false;

        payable(TAX_ADDRESS).transfer(CREATION_FEE_ETH); // Send creation fee to tax address

        emit BountyCreated(bountyId, _content, msg.sender);
    }

    function upvoteBounty(uint256 _bountyId) public payable {
        require(msg.value >= MIN_UPVOTE_ETH, "Minimum 0.01 ETH for upvoting");
        require(!hasUpvoted[_bountyId][msg.sender], "Already upvoted");

        Bounty storage bounty = bounties[_bountyId];
        uint256 shares = msg.value / bounty.sharePrice;
        require(shares > 0, "Payment not enough for any shares");

        bounty.funds += msg.value;
        bounty.upvoteCount += 1;
        bounty.sharePrice += shares; // Increase share price
        bounty.shareholders[msg.sender] += shares;
        if (bounty.shareholders[msg.sender] == shares) {
            // If this is the first time buying shares
            bounty.shareholderList.push(msg.sender);
        }
        hasUpvoted[_bountyId][msg.sender] = true;

        emit BountyUpvoted(_bountyId, msg.sender, shares);
    }

    function withdrawFunds(uint256 _bountyId) public {
        Bounty storage bounty = bounties[_bountyId];
        require(msg.sender == bounty.author, "Only the bounty author can withdraw funds");
        require(!bounty.withdrawn, "Funds have already been withdrawn");

        uint256 withdrawalAmount = bounty.funds / 20; // 5% of the funds
        require(withdrawalAmount <= bounty.funds, "Insufficient funds");
        bounty.funds -= withdrawalAmount;
        bounty.withdrawn = true; // Mark as withdrawn
        payable(msg.sender).transfer(withdrawalAmount);

        emit FundsWithdrawn(_bountyId, withdrawalAmount);
    }

    // Functions for selling shares and other operations can be added here
}
