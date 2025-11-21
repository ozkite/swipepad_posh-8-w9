// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IMultiSigWallet.sol";

/**
 * @title MultiSigWallet
 * @dev Multi-signature wallet for SwipePad treasury
 * @notice Requires multiple signatures to execute transactions
 */
contract MultiSigWallet is IMultiSigWallet, Ownable, ReentrancyGuard {
    // Events
    event Submission(uint256 indexed transactionId);
    event Confirmation(address indexed owner, uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event ExecutionFailure(uint256 indexed transactionId);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed oldOwner);
    public override view returns (bool) {
        return isOwner[msg.sender];
    }

    /**
     * @dev Add a new owner
     * @param owner The address of the new owner
     */
    function addOwner(address owner) public override onlyOwner {
        require(!isOwner[owner], "Owner already exists");
        require(owners.length < MAX_OWNER_COUNT, "Maximum owner count reached");
        
        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAdded(owner);
    }

    /**
     * @dev Remove an owner
     * @param owner The address of the owner to remove
     */
    function removeOwner(address owner) public override onlyOwner {
        require(isOwner[owner], "Not an owner");
        require(owners.length > 1, "Cannot remove last owner");
        require(requiredSignatures <= owners.length - 1, "Cannot reduce required signatures below owner count");
        
        isOwner[owner] = false;
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                owners.pop();
                break;
            }
        }
        
        emit OwnerRemoved(owner);
    }

    /**
     * @dev Replace an owner
     * @param owner The address of the owner to replace
     * @param newOwner The address of the new owner
     */
    function replaceOwner(address owner, address newOwner) public override onlyOwner {
        require(isOwner[owner], "Not an owner");
        require(!isOwner[newOwner], "New owner already exists");
        
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == owner) {
                owners[i] = newOwner;
                break;
            }
        }
        
        isOwner[owner] = false;
        isOwner[newOwner] = true;
        
        emit OwnerRemoved(owner);
        emit OwnerAdded(newOwner);
    }

    /**
     * @dev Change the required number of signatures
     * @param _requiredSignatures The new required number of signatures
     */
    function changeRequirement(uint256 _requiredSignatures) public override onlyOwner {
        require(_requiredSignatures <= owners.length, "Cannot require more signatures than owners");
        require(_requiredSignatures >= 1, "At least one signature required");
        
        requiredSignatures = _requiredSignatures;
    }

    /**
     * @dev Submit a transaction
     * @param destination The destination address
     * @param value The ETH value to send
     * @param data The transaction data
     * @return The transaction ID
     */
    function submitTransaction(address destination, uint256 value, bytes memory data) public override returns (uint256 transactionId) {
        require(isOwner[msg.sender], "Not an owner");
        
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        });
        
        transactionCount += 1;
        emit Submission(transactionId);
    }

    /**
     * @dev Submit a token transaction
     * @param token The token contract address
     * @param destination The destination address
     * @param amount The amount of tokens to send
     * @return The transaction ID
     */
    function submitTokenTransaction(address token, address destination, uint256 amount) public override returns (uint256 transactionId) {
        require(isOwner[msg.sender], "Not an owner");
        
        // Create approve call data
        bytes memory data = abi.encodeWithSignature("approve(address,uint256)", destination, amount);
        
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: token,
            value: 0,
            data: data,
            executed: false
        });
        
        transactionCount += 1;
        emit Submission(transactionId);
    }

    /**
     * @dev Confirm a transaction
     * @param transactionId The ID of the transaction to confirm
     */
    function confirmTransaction(uint256 transactionId) public override {
        require(isOwner[msg.sender], "Not an owner");
        require(!confirmations[transactionId][msg.sender], "Already confirmed");
        require(transactionId < transactionCount, "Invalid transaction ID");
        
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
    }

    /**
     * @dev Execute a transaction
     * @param transactionId The ID of the transaction to execute
     * @return success Whether the transaction was executed successfully
     */
    function executeTransaction(uint256 transactionId) public override nonReentrant returns (bool success) {
        require(isOwner[msg.sender], "Not an owner");
        require(transactionId < transactionCount, "Invalid transaction ID");
        require(!transactions[transactionId].executed, "Transaction already executed");
        require(isConfirmed(transactionId), "Transaction not confirmed");
        
        Transaction storage txn = transactions[transactionId];
        txn.executed = true;
        
        (success, ) = txn.destination.call{value: txn.value}(txn.data);
        
        if (success) {
            emit Execution(transactionId);
        } else {
            emit ExecutionFailure(transactionId);
        }
    }

    /**
     * @dev Get the confirmation count for a transaction
     * @param transactionId The ID of the transaction
     * @return count The number of confirmations
     */
    function getConfirmationCount(uint256 transactionId) public override view returns (uint256 count) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]]) {
                count += 1;
            }
        }
    }

    /**
     * @dev Check if a transaction is confirmed
     * @param transactionId The ID of the transaction
     * @return confirmed Whether the transaction is confirmed
     */
    function isConfirmed(uint256 transactionId) public override view returns (bool) {
        return getConfirmationCount(transactionId) >= requiredSignatures;
    }

    /**
     * @dev Get the list of owners
     * @return The list of owner addresses
     */
    function getOwners() public override view returns (address[] memory) {
        return owners;
    }

    /**
     * @dev Get the transaction count
     * @return The number of transactions
     */
    function getTransactionCount() public override view returns (uint256) {
        return transactionCount;
    }

    /**
     * @dev Get a transaction
     * @param transactionId The ID of the transaction
     * @return destination The destination address
     * @return value The ETH value
     * @return data The transaction data
     * @return executed Whether the transaction has been executed
     */
    function getTransaction(uint256 transactionId) public override view returns (address destination, uint256 value, bytes memory data, bool executed) {
        Transaction storage txn = transactions[transactionId];
        return (txn.destination, txn.value, txn.data, txn.executed);
    }
}
