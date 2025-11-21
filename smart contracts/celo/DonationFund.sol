// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DonationFund
 * @dev A simple donation contract using cUSD on Celo
 */
contract DonationFund {
    address public owner;
    uint256 public totalDonations;
    uint256 public donorCount;

    // cUSD token on Celo (mainnet)
    IERC20 public constant cUSD = IERC20(0x765De81684586fAe26300cc7aEd2dF4Aee21EdC9);

    mapping(address => bool) public isDonor;
    mapping(address => uint256) public donations;

    event Donated(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        revert("This contract accepts only cUSD");
    }

    function donate(uint256 amount) external {
        require(amount > 0, "Must donate more than 0");

        if (!isDonor[msg.sender]) {
            isDonor[msg.sender] = true;
            donorCount++;
        }

        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        donations[msg.sender] += amount;
        totalDonations += amount;

        emit Donated(msg.sender, amount);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        uint256 balance = cUSD.balanceOf(address(this));
        require(balance > 0, "No funds");
        require(cUSD.transfer(owner, balance), "Withdrawal failed");
        emit FundsWithdrawn(owner, balance);
    }
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
