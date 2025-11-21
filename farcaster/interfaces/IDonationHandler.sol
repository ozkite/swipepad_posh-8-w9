// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IDonationHandler {
    event DonationMade(
        address indexed donor,
        address indexed recipient,
        address indexed token,
        uint256 amount,
        uint256 timestamp,
        bytes32 indexed projectId
    );

    event TokenSupportUpdated(address indexed token, bool supported);

    function donate(
        address recipient,
        address token,
        uint256 amount,
        bytes32 projectId
    ) external;

    function batchDonate(
        address[] calldata recipients,
        address token,
        uint256[] calldata amounts,
        bytes32[] calldata projectIds
    ) external;

    function addSupportedToken(address token) external;

    function removeSupportedToken(address token) external;

    function setAuthorizedCaller(address caller, bool authorized) external;

    function emergencyWithdraw(address token, uint256 amount) external;

    function isTokenSupported(address token) external view returns (bool);

    function isCallerAuthorized(address caller) external view returns (bool);
}
