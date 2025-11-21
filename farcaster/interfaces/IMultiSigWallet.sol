// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMultiSigWallet {
    event Submission(uint256 indexed transactionId);
    event Confirmation(address indexed owner, uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event ExecutionFailure(uint256 indexed transactionId);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed oldOwner);

    function addOwner(address owner) external;

    function removeOwner(address owner) external;

    function replaceOwner(address owner, address newOwner) external;

    function changeRequirement(uint256 _requiredSignatures) external;

    function submitTransaction(address destination, uint256 value, bytes memory data) external returns (uint256 transactionId);

    function submitTokenTransaction(address token, address destination, uint256 amount) external returns (uint256 transactionId);

    function confirmTransaction(uint256 transactionId) external;

    function executeTransaction(uint256 transactionId) external returns (bool success);

    function getConfirmationCount(uint256 transactionId) external view returns (uint256 count);

    function isConfirmed(uint256 transactionId) external view returns (bool);

    function getOwners() external view returns (address[] memory);

    function getTransactionCount() external view returns (uint256);

    function getTransaction(uint256 transactionId) external view returns (address destination, uint256 value, bytes memory data, bool executed);
}
