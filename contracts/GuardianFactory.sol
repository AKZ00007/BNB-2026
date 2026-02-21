// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GuardianToken.sol";

/**
 * @title GuardianFactory
 * @dev Factory contract for deploying GuardianToken instances.
 *
 * Anyone can deploy a protected token through this factory.
 * The factory tracks all deployments and emits events for indexing.
 *
 * Usage from frontend:
 *   const tx = await factory.createGuardianToken(
 *     "NeuralChain", "NRCH", 1000000, 2, 3, 300, 500, 60, taxReceiver
 *   );
 *   const receipt = await tx.wait();
 *   // Token address is in the TokenCreated event
 */
contract GuardianFactory {

    // ── State ────────────────────────────────────────────────────────────────

    struct TokenRecord {
        address tokenAddress;
        address creator;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 createdAt;
    }

    TokenRecord[] public allTokens;
    mapping(address => TokenRecord[]) public creatorTokens;

    // ── Events ───────────────────────────────────────────────────────────────

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply,
        uint256 maxWalletPct,
        uint256 antiBotBlocks,
        uint256 buyTaxBps,
        uint256 sellTaxBps,
        uint256 cooldownSec
    );

    // ── Factory Method ───────────────────────────────────────────────────────

    /**
     * @dev Deploy a new GuardianToken with the given configuration.
     * @param name_          Token name
     * @param symbol_        Token symbol
     * @param totalSupply_   Total supply in whole tokens
     * @param maxWalletPct_  Max wallet as % of supply
     * @param antiBotBlocks_ Anti-snipe block count
     * @param buyTaxBps_     Buy tax in basis points
     * @param sellTaxBps_    Sell tax in basis points
     * @param cooldownSec_   Sell cooldown in seconds
     * @param taxReceiver_   Address to receive taxes
     * @return tokenAddress  The deployed token address
     */
    function createGuardianToken(
        string calldata name_,
        string calldata symbol_,
        uint256 totalSupply_,
        uint256 maxWalletPct_,
        uint256 antiBotBlocks_,
        uint256 buyTaxBps_,
        uint256 sellTaxBps_,
        uint256 cooldownSec_,
        address taxReceiver_
    ) external returns (address tokenAddress) {
        // Deploy token — ownership goes to the caller
        GuardianToken token = new GuardianToken(
            name_,
            symbol_,
            totalSupply_,
            maxWalletPct_,
            antiBotBlocks_,
            buyTaxBps_,
            sellTaxBps_,
            cooldownSec_,
            taxReceiver_
        );

        tokenAddress = address(token);

        // Transfer ownership from factory to the actual deployer
        token.transferOwnership(msg.sender);

        // Record
        TokenRecord memory record = TokenRecord({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name_,
            symbol: symbol_,
            totalSupply: totalSupply_,
            createdAt: block.timestamp
        });

        allTokens.push(record);
        creatorTokens[msg.sender].push(record);

        emit TokenCreated(
            tokenAddress,
            msg.sender,
            name_,
            symbol_,
            totalSupply_,
            maxWalletPct_,
            antiBotBlocks_,
            buyTaxBps_,
            sellTaxBps_,
            cooldownSec_
        );
    }

    // ── View Functions ───────────────────────────────────────────────────────

    /**
     * @dev Returns the total number of tokens ever created.
     */
    function totalTokens() external view returns (uint256) {
        return allTokens.length;
    }

    /**
     * @dev Returns all tokens created by a specific wallet.
     */
    function getTokensByCreator(address creator) external view returns (TokenRecord[] memory) {
        return creatorTokens[creator];
    }

    /**
     * @dev Returns paginated list of all tokens. Offset + limit pattern.
     */
    function getTokensPaginated(uint256 offset, uint256 limit) external view returns (TokenRecord[] memory tokens) {
        uint256 total = allTokens.length;
        if (offset >= total) return new TokenRecord[](0);

        uint256 end = offset + limit;
        if (end > total) end = total;

        tokens = new TokenRecord[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            tokens[i - offset] = allTokens[i];
        }
    }
}
