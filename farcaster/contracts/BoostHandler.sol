// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IBoostHandler.sol";

/**
 * @title BoostHandler
 * @dev Contract to handle boost payments from users to projects and SwipePad treasury
 * @notice This contract takes a percentage fee for SwipePad and forwards the rest to projects
 */
contract BoostHandler is IBoostHandler, Ownable, ReentrancyGuard {
    // Events
    event BoostCreated(
        address indexed booster,
        address indexed project,
        address indexed token,
        uint256 amount,
        uint256 duration,
        uint256 timestamp,
        uint256 boostId
    );

    event BoostDeactivated(uint256 indexed boostId);

    event TreasuryFeeCollected(
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event TreasuryWalletUpdated(address indexed oldWallet, address indexed newWallet);

    event TreasuryFeePercentageUpdated(uint256 oldPercentage, uint256 newPercentage);

    // Structs
    struct Boost {
        address booster;
        address project;
        address token;
        uint256 amount;
        uint256 duration;
        uint256 timestamp;
        bool active;
    }

    // State variables
    address public treasuryWallet;
    uint256 public treasuryFeePercentage = 10; // 10% fee goes to SwipePad
    mapping(address => bool) public supportedTokens;
    mapping(uint256 => Boost) public boosts;
    mapping(address => bool) public authorizedCallers;
    uint256 public nextBoostId = 1;

    // Constructor
    constructor(address _treasuryWallet) {
        treasuryWallet = _treasuryWallet;
        
        // Initialize supported tokens (cUSD, USDT, USDC, cEUR)
        supportedTokens[0x765DE816845861e75A25fCA122bb6898B8B1282a] = true; // cUSD
        supportedTokens[0x48065fbBE25f71C9282ddf4e1dAA6e138Da8d794] = true; // USDT
        supportedTokens[0x37f750B7cC259A2f741AF45294f6a16572CF5c78] = true; // USDC
        supportedTokens[0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73] = true; // cEUR
        
        // Authorize contract deployer
        authorizedCallers[msg.sender] = true;
    }

    /**
     * @dev Create a boost for a project
     * @param project The project wallet address
     * @param token The token contract address
     * @param amount The boost amount
     * @param duration The boost duration in days
     */
    function createBoost(
        address project,
        address token,
        uint256 amount,
        uint256 duration
    ) external nonReentrant {
        require(supportedTokens[token], "Token not supported");
        require(project != address(0), "Invalid project address");
        require(amount > 0, "Amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");

        // Calculate treasury fee (SwipePad's revenue)
        uint256 feeAmount = (amount * treasuryFeePercentage) / 100;
        uint256 projectAmount = amount - feeAmount;

        // Transfer tokens from booster to contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Transfer fee to treasury (SwipePad wallet)
        if (feeAmount > 0) {
            IERC20(token).transfer(treasuryWallet, feeAmount);
            emit TreasuryFeeCollected(token, feeAmount, block.timestamp);
        }
        
        // Transfer remaining amount to project
        IERC20(token).transfer(project, projectAmount);

        // Create boost record
        boosts[nextBoostId] = Boost({
            booster: msg.sender,
            project: project,
            token: token,
            amount: projectAmount,
            duration: duration,
            timestamp: block.timestamp,
            active: true
        });

        // Emit event
        emit BoostCreated(msg.sender, project, token, projectAmount, duration, block.timestamp, nextBoostId);

        // Increment next boost ID
        nextBoostId++;
    }

    /**
     * @dev Deactivate a boost
     * @param boostId The boost ID to deactivate
     */
    function deactivateBoost(uint256 boostId) external {
        require(boosts[boostId].active, "Boost is not active");
        require(
            boosts[boostId].booster == msg.sender || msg.sender == owner() || authorizedCallers[msg.sender],
            "Not authorized to deactivate this boost"
        );
        
        boosts[boostId].active = false;
        emit BoostDeactivated(boostId);
    }

    /**
     * @dev Set treasury wallet
     * @param _treasuryWallet The new treasury wallet address
     */
    function setTreasuryWallet(address _treasuryWallet) external onlyOwner {
        require(_treasuryWallet != address(0), "Invalid treasury wallet");
        address oldWallet = treasuryWallet;
        treasuryWallet = _treasuryWallet;
        emit TreasuryWalletUpdated(oldWallet, _treasuryWallet);
    }

    /**
     * @dev Set treasury fee percentage
     * @param _percentage The new fee percentage
     */
    function setTreasuryFeePercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 20, "Fee cannot exceed 20%");
        uint256 oldPercentage = treasuryFeePercentage;
        treasuryFeePercentage = _percentage;
        emit TreasuryFeePercentageUpdated(oldPercentage, _percentage);
    }

    /**
     * @dev Add a supported token
     * @param token The token contract address
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    /**
     * @dev Remove a supported token
     * @param token The token contract address
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
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
     * @dev Get active boosts for a project
     * @param project The project wallet address
     * @return Array of active boost IDs
     */
    function getActiveBoostsForProject(address project) external view returns (uint256[] memory) {
        uint256[] memory activeBoostIds = new uint256[](nextBoostId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextBoostId; i++) {
            if (boosts[i].active && boosts[i].project == project) {
                activeBoostIds[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeBoostIds[i];
        }
        
        return result;
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
