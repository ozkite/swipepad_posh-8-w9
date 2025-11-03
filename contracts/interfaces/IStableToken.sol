// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IStableToken
 * @dev Minimal interface for Celo's StableToken (ERC20 with allowance)
 */
interface IStableToken {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function decimals() external view returns (uint8);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
}
