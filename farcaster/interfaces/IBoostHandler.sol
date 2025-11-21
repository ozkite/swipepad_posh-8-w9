// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBoostHandler {
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

    function createBoost(
        address project,
        address token,
        uint256 amount,
        uint256 duration
    ) external;

    function deactivateBoost(uint256 boostId) external;

    function setTreasuryWallet(address _treasuryWallet) external;

    function setTreasuryFeePercentage(uint256 _percentage) external;

    function addSupportedToken(address token) external;

    function removeSupportedToken(address token) external;

    function setAuthorizedCaller(address caller, bool authorized) external;

    function getActiveBoostsForProject(address project) external view returns (uint256[] memory);

    function isTokenSupported(address token) external view returns (bool);

    function isCallerAuthorized(address caller) external view returns (bool);
}
