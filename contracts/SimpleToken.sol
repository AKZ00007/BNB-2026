// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleToken
 * @dev Minimal ERC-20 for the AI Token Launchpad Designer.
 *      Mints the entire supply to the deployer.
 *      Constructor args: name, symbol, totalSupplyWhole (e.g. 1000000 = 1M tokens)
 */
contract SimpleToken is ERC20, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupplyWhole
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        _mint(msg.sender, totalSupplyWhole * 10 ** decimals());
    }
}
