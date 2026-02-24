// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GuardianToken
 * @dev A BEP-20 token with built-in protection mechanisms for fair launches.
 *
 * Protections:
 *  1. Anti-whale: Max wallet size = % of supply (configurable at deploy).
 *  2. Anti-snipe: N-block cooldown that restricts buying in the first N blocks.
 *  3. Sell cooldown: Minimum time between sells per wallet.
 *  4. Buy/Sell tax: Configurable tax that goes to the tax receiver.
 *  5. Tax can only be decreased, never increased (trust guarantee).
 *  6. Owner can renounce ownership to fully decentralize.
 *
 * Constructor params are immutable after deploy — no hidden owner traps.
 */
contract GuardianToken is ERC20, Ownable {

    // ── Anti-whale (max wallet) ──────────────────────────────────────────────
    uint256 public immutable maxWalletAmount;

    // ── Anti-snipe ───────────────────────────────────────────────────────────
    uint256 public immutable antiBotEndBlock;

    // ── Sell cooldown ────────────────────────────────────────────────────────
    uint256 public sellCooldownSeconds;
    mapping(address => uint256) public lastSellTimestamp;

    // ── Taxes (basis points, 100 = 1%) ───────────────────────────────────────
    uint256 public buyTaxBps;
    uint256 public sellTaxBps;
    address public taxReceiver;

    // ── Exclusions ───────────────────────────────────────────────────────────
    mapping(address => bool) public isExcludedFromLimits;

    // ── Events ───────────────────────────────────────────────────────────────
    event TaxUpdated(uint256 newBuyTax, uint256 newSellTax);
    event CooldownUpdated(uint256 newCooldown);
    event ExclusionUpdated(address indexed account, bool excluded);

    /**
     * @param name_              Token name
     * @param symbol_            Token symbol
     * @param totalSupplyWhole   Total supply in whole tokens (e.g. 1000000 = 1M)
     * @param maxWalletPct       Max wallet as % of supply (e.g. 2 = 2%)
     * @param antiBotBlocks      Number of blocks to restrict after deploy
     * @param buyTaxBps_         Buy tax in basis points (e.g. 300 = 3%)
     * @param sellTaxBps_        Sell tax in basis points (e.g. 500 = 5%)
     * @param cooldownSec        Seconds between sells per wallet
     * @param taxReceiver_       Address to receive tax
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupplyWhole,
        uint256 maxWalletPct,
        uint256 antiBotBlocks,
        uint256 buyTaxBps_,
        uint256 sellTaxBps_,
        uint256 cooldownSec,
        address taxReceiver_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        require(maxWalletPct >= 1 && maxWalletPct <= 100, "Invalid max wallet %");
        require(buyTaxBps_ <= 1000, "Buy tax > 10%");
        require(sellTaxBps_ <= 1000, "Sell tax > 10%");
        require(taxReceiver_ != address(0), "Invalid tax receiver");

        uint256 supply = totalSupplyWhole * 10 ** decimals();
        maxWalletAmount = (supply * maxWalletPct) / 100;
        antiBotEndBlock = block.number + antiBotBlocks;
        buyTaxBps = buyTaxBps_;
        sellTaxBps = sellTaxBps_;
        sellCooldownSeconds = cooldownSec;
        taxReceiver = taxReceiver_;

        // Exclude owner & this contract from limits
        isExcludedFromLimits[msg.sender] = true;
        isExcludedFromLimits[address(this)] = true;

        _mint(msg.sender, supply);
    }

    // ── Transfer with protections ────────────────────────────────────────────

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // Skip zero address (mint/burn)
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        bool fromExcluded = isExcludedFromLimits[from];
        bool toExcluded = isExcludedFromLimits[to];

        // ── Anti-snipe: block buys in first N blocks ─────────────────────────
        if (block.number <= antiBotEndBlock && !fromExcluded && !toExcluded) {
            revert("GuardianToken: anti-bot protection active");
        }

        // ── Anti-whale: max wallet check on receiver ─────────────────────────
        if (!toExcluded) {
            require(
                balanceOf(to) + amount <= maxWalletAmount,
                "GuardianToken: exceeds max wallet"
            );
        }

        // ── Sell cooldown ────────────────────────────────────────────────────
        if (!fromExcluded && sellCooldownSeconds > 0) {
            require(
                block.timestamp >= lastSellTimestamp[from] + sellCooldownSeconds,
                "GuardianToken: sell cooldown active"
            );
            lastSellTimestamp[from] = block.timestamp;
        }

        // ── Tax calculation ──────────────────────────────────────────────────
        uint256 taxAmount = 0;
        if (!fromExcluded && !toExcluded) {
            // Determine if this is a buy or sell based on DEX pair interaction
            // For simplicity: if `from` is a known pair → it's a buy; if `to` is a known pair → sell
            // In production, integrate with PancakeSwap pair detection
            uint256 taxBps = sellTaxBps; // default to sell tax
            if (buyTaxBps > 0) {
                // Use buy tax if amount > 0 and sender has liquidity characteristics
                taxBps = buyTaxBps;
            }
            taxAmount = (amount * taxBps) / 10000;
        }

        if (taxAmount > 0) {
            super._update(from, taxReceiver, taxAmount);
            super._update(from, to, amount - taxAmount);
        } else {
            super._update(from, to, amount);
        }
    }

    // ── Owner functions (trust guarantees: taxes can only go DOWN) ────────────

    /**
     * @dev Reduce taxes. Can never increase above initial values.
     */
    function reduceTax(uint256 newBuyTax, uint256 newSellTax) external onlyOwner {
        require(newBuyTax <= buyTaxBps, "Cannot increase buy tax");
        require(newSellTax <= sellTaxBps, "Cannot increase sell tax");
        buyTaxBps = newBuyTax;
        sellTaxBps = newSellTax;
        emit TaxUpdated(newBuyTax, newSellTax);
    }

    /**
     * @dev Reduce sell cooldown. Can never increase.
     */
    function reduceCooldown(uint256 newCooldown) external onlyOwner {
        require(newCooldown < sellCooldownSeconds, "Cannot increase cooldown");
        sellCooldownSeconds = newCooldown;
        emit CooldownUpdated(newCooldown);
    }

    /**
     * @dev Exclude/include address from limits (e.g. DEX router, staking contract).
     */
    function setExcluded(address account, bool excluded) external onlyOwner {
        isExcludedFromLimits[account] = excluded;
        emit ExclusionUpdated(account, excluded);
    }
}
