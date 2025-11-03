// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IStableToken.sol";

/**
 * @title DonationEscrow
 * @dev Allows users to donate to verified projects on Celo
 *      Funds are sent directly to project wallet — no custody
 */
contract DonationEscrow {
    address public immutable owner;
    mapping(address => bool) public approvedProjects;

    event DonationSent(
        address indexed donor,
        address indexed project,
        address indexed token,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProject(address _project) external onlyOwner {
        approvedProjects[_project] = true;
    }

    function removeProject(address _project) external onlyOwner {
        approvedProjects[_project] = false;
    }

    /**
     * @notice Donate stablecoins directly to an approved project
     * @param _project Recipient wallet (must be approved)
     * @param _token StableToken address (e.g., cUSD, cEUR)
     * @param _amount Amount to donate
     */
    function donate(
        address _project,
        address _token,
        uint256 _amount
    ) external {
        require(approvedProjects[_project], "Project not approved");
        require(_amount > 0, "Amount must be > 0");

        IStableToken token = IStableToken(_token);
        require(token.transferFrom(msg.sender, _project, _amount), "Transfer failed");

        emit DonationSent(msg.sender, _project, _token, _amount);
    }
}
