// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title LiquidityController
 * @dev Handles the Progressive Liquidity Unlock (PLU) mechanism.
 *      LP tokens are locked here. Instead of pure time-based unlocks,
 *      unlocks require a signed "health score" from the Guardian Oracle.
 */
contract LiquidityController is Ownable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    address public guardianOracle; // The backend wallet that signs health scores

    struct Milestone {
        uint256 unlockTimestamp;
        uint256 amountToUnlock;
        bool isUnlocked;
    }

    struct LockSession {
        address deployer;
        address lpToken;
        uint256 totalLocked;
        uint256 totalUnlocked;
        bool emergencyFrozen;
        Milestone[] milestones;
    }

    // Mapping from (Project Token Address) -> LockSession
    // Using project token address as the key ties the PLU to the specific token
    mapping(address => LockSession) public locks;

    event Locked(address indexed token, address indexed lpToken, uint256 amount);
    event Unlocked(address indexed token, uint256 amount, uint256 healthScore);
    event PenaltyApplied(address indexed token, uint256 delayDays, uint256 healthScore);
    event EmergencyFrozen(address indexed token, string reason);

    constructor(address _oracle) Ownable(msg.sender) {
        guardianOracle = _oracle;
    }

    /**
     * @dev Set the backend oracle address that signs health scores
     */
    function setOracle(address _oracle) external onlyOwner {
        guardianOracle = _oracle;
    }

    /**
     * @dev Lock LP tokens and define the unlock schedule
     * @param projectToken The GuardianToken address
     * @param lpToken The AMM Pair token address (e.g. PancakeSwap V2 Pair)
     * @param amount Total LP tokens to lock
     * @param unlockTimestamps Array of unix timestamps for each milestone
     * @param unlockAmounts Array of LP token amounts for each milestone
     */
    function lockLP(
        address projectToken,
        address lpToken,
        uint256 amount,
        uint256[] calldata unlockTimestamps,
        uint256[] calldata unlockAmounts
    ) external {
        require(locks[projectToken].deployer == address(0), "Already locked for this token");
        require(unlockTimestamps.length == unlockAmounts.length, "Array length mismatch");
        require(unlockTimestamps.length > 0, "No milestones");

        uint256 totalScheduleAmount = 0;
        for (uint256 i = 0; i < unlockAmounts.length; i++) {
            totalScheduleAmount += unlockAmounts[i];
        }
        require(totalScheduleAmount == amount, "Schedule amounts must equal total");

        IERC20(lpToken).safeTransferFrom(msg.sender, address(this), amount);

        LockSession storage session = locks[projectToken];
        session.deployer = msg.sender;
        session.lpToken = lpToken;
        session.totalLocked = amount;
        
        for (uint256 i = 0; i < unlockTimestamps.length; i++) {
            session.milestones.push(Milestone({
                unlockTimestamp: unlockTimestamps[i],
                amountToUnlock: unlockAmounts[i],
                isUnlocked: false
            }));
        }

        emit Locked(projectToken, lpToken, amount);
    }

    /**
     * @dev Process an unlock for a specific milestone using an oracle signature
     * @param projectToken The token to unlock LP for
     * @param milestoneIndex The index of the milestone to unlock
     * @param healthScore The 0-100 health score evaluated by the AI
     * @param signature The ECDSA signature from the oracle
     */
    function processUnlock(
        address projectToken,
        uint256 milestoneIndex,
        uint256 healthScore,
        bytes calldata signature
    ) external {
        LockSession storage session = locks[projectToken];
        require(session.deployer == msg.sender, "Not the deployer");
        require(!session.emergencyFrozen, "Lock is emergency frozen");
        require(milestoneIndex < session.milestones.length, "Invalid milestone");
        
        Milestone storage milestone = session.milestones[milestoneIndex];
        require(!milestone.isUnlocked, "Already unlocked");
        require(block.timestamp >= milestone.unlockTimestamp, "Milestone time not reached");

        // Verify Oracle Signature
        // Message hash: keccak256(abi.encodePacked(projectToken, milestoneIndex, healthScore))
        bytes32 messageHash = keccak256(abi.encodePacked(projectToken, milestoneIndex, healthScore));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        require(signer == guardianOracle, "Invalid oracle signature");

        // Apply health-based logic derived from PRD
        if (healthScore >= 80) {
            // HEALTHY: Standard unlock
            milestone.isUnlocked = true;
            session.totalUnlocked += milestone.amountToUnlock;
            IERC20(session.lpToken).safeTransfer(session.deployer, milestone.amountToUnlock);
            emit Unlocked(projectToken, milestone.amountToUnlock, healthScore);

        } else if (healthScore >= 50) {
            // CAUTION: Extend lock period by 14 days
            milestone.unlockTimestamp = block.timestamp + 14 days;
            emit PenaltyApplied(projectToken, 14, healthScore);

        } else {
            // DANGER: Freeze the entire lock indefinitely
            session.emergencyFrozen = true;
            emit EmergencyFrozen(projectToken, "Critical health score drop - DANGER mode activated");
        }
    }

    /**
     * @dev Emergency manual freeze by platform owner (defense in depth)
     */
    function emergencyFreeze(address projectToken) external onlyOwner {
        locks[projectToken].emergencyFrozen = true;
        emit EmergencyFrozen(projectToken, "Manual intervention by Guardian platform");
    }

    /**
     * @dev View function to get all milestones for a token
     */
    function getMilestones(address projectToken) external view returns (Milestone[] memory) {
        return locks[projectToken].milestones;
    }
}
