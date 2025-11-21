// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IDonationHandler.sol";

/**
 * @title DonationHandler
 * @dev Contract to handle direct donations from users to project wallets
 * @notice This contract facilitates direct donations without taking any fees
 */
contract DonationHandler is IDonationHandler, Ownable, ReentrancyGuard {
    // Events
    event DonationMade(
        address indexed donor,
        address indexed recipient,
        address indexed token,
        uint256 amount,
        uint256 timestamp,
        bytes32 indexed projectId
    );

    event TokenSupportUpdated(address indexed token, bool supported);

    // State variables
    mapping(address => bool) public supportedTokens;
    mapping(address => bool) public authorizedCallers;
    
    // Constructor
    constructor() {
        // Initialize supported tokens (cUSD, USDT, USDC, cEUR)
        supportedTokens[0x765DE816845861e75A25fCA122bb6898B8B1282a] = true; // cUSD
        supportedTokens[0x48065fbBE25f71C9282ddf4e1dAA6e138Da8d794] = true; // USDT
        supportedTokens[0x37f750B7cC259A2f741AF45294f6a16572CF5c78] = true; // USDC
        supportedTokens[0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73] = true; // cEUR
        
        // Authorize contract deployer
        authorizedCallers[msg.sender] = true;
    }

    /**
     * @dev Make a direct donation to a project
     * @param recipient The project wallet address
     * @param token The token contract address
     * @param amount The donation amount
     * @param projectId The unique project identifier
     */
    function donate(
        address recipient,
        address token,
        uint256 amount,
        bytes32 projectId
    ) external nonReentrant {
        require(supportedTokens[token], "Token not supported");
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from donor to contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Transfer tokens from contract to recipient (100% goes to project)
        IERC20(token).transfer(recipient, amount);

        // Emit event
        emit DonationMade(msg.sender, recipient, token, amount, block.timestamp, projectId);
    }

    /**
     * @dev Batch donation to multiple projects
     * @param recipients Array of project wallet addresses
     * @param token The token contract address
     * @param amounts Array of donation amounts
     * @param projectIds Array of project identifiers
     */
    function batchDonate(
        address[] calldata recipients,
        address token,
        uint256[] calldata amounts,
        bytes32[] calldata projectIds
    ) external nonReentrant {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length == projectIds.length, "Arrays length mismatch");
        require(supportedTokens[token], "Token not supported");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        // Transfer total amount from donor to contract
        IERC20(token).transferFrom(msg.sender, address(this), totalAmount);
        
        // Transfer to each recipient
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(amounts[i] > 0, "Amount must be greater than 0");
            
            IERC20(token).transfer(recipients[i], amounts[i]);
            emit DonationMade(msg.sender, recipients[i], token, amounts[i], block.timestamp, projectIds[i]);
        }
    }

    /**
     * @dev Add a supported token
     * @param token The token contract address
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
        emit TokenSupportUpdated(token, true);
    }

    /**
     * @dev Remove a supported token
     * @param token The token contract address
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
        emit TokenSupportUpdated(token, false);
    }

    /**
     * @dev Authorize a caller (e.g., Farcaster Frame contract)
     * @param caller The address to authorize
     * @param authorized Whether to authorize or deauthorize
     */
    function setAuthorizedCaller(address caller, bool authorized) external onlyOwner {
        authorizedCallers[caller] = authorized;
    }

    /**
     * @dev Emergency withdraw tokens
     * @param token The token contract address
     * @param amount The amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    /**
     * @dev Check if a token is supported
     * @param token The token contract address
     * @return Whether the token is supported
     */
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }

    /**
     * @dev Check if a caller is authorized
     * @param caller The address to check
     * @return Whether the caller is authorized
     */
    function isCallerAuthorized(address caller) external view returns (bool) {
        return authorizedCallers[caller];
    }
}
