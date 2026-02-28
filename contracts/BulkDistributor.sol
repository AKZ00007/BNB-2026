// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BulkDistributor
 * @dev Reusable contract for bulk-transferring ERC20 tokens in a single transaction.
 * Used primarily for Guardian Incentive Suite features:
 * - Smart Snapshot Loyalty Airdrops
 * - Liquidity Provider Loyalty Rewards
 *
 * It is kept intentionally "dumb". The intelligence (who gets what) happens off-chain,
 * and this contract simply executes the array of transfers provided by the authorized caller.
 */
contract BulkDistributor is Ownable {
    using SafeERC20 for IERC20;

    event BulkTransferCompleted(address indexed token, uint256 totalRecipients, uint256 totalAmount);
    event EmergencyWithdrawn(address indexed token, address indexed to, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Distributes `token` to an array of `recipients` with corresponding `amounts`.
     * The caller MUST have approved this contract to spend the total amount of tokens.
     * @param token The ERC20 token address to distribute.
     * @param recipients Array of wallet addresses to receive tokens.
     * @param amounts Array of token amounts for each recipient (must match recipients length).
     */
    function bulkTransfer(
        IERC20 token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length > 0, "Empty recipients array");
        require(recipients.length == amounts.length, "Array length mismatch");

        uint256 totalAmount = 0;
        
        // Loop through and execute transfers
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(amounts[i] > 0, "Invalid amount");

            // SafeERC20 handles non-standard ERC20 return values
            token.safeTransferFrom(msg.sender, recipients[i], amounts[i]);
            totalAmount += amounts[i];
        }

        emit BulkTransferCompleted(address(token), recipients.length, totalAmount);
    }
}
