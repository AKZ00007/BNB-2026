export const LIQUIDITY_CONTROLLER_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "_oracle", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ECDSAInvalidSignature",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "length", "type": "uint256" }],
        "name": "ECDSAInvalidSignatureLength",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "bytes32", "name": "s", "type": "bytes32" }],
        "name": "ECDSAInvalidSignatureS",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "reason", "type": "string" }
        ],
        "name": "EmergencyFrozen",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "lpToken", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "Locked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "delayDays", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "healthScore", "type": "uint256" }
        ],
        "name": "PenaltyApplied",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "healthScore", "type": "uint256" }
        ],
        "name": "Unlocked",
        "type": "event"
    },
    {
        "inputs": [{ "internalType": "address", "name": "projectToken", "type": "address" }],
        "name": "emergencyFreeze",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "projectToken", "type": "address" }],
        "name": "getMilestones",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "unlockTimestamp", "type": "uint256" },
                    { "internalType": "uint256", "name": "amountToUnlock", "type": "uint256" },
                    { "internalType": "bool", "name": "isUnlocked", "type": "bool" }
                ],
                "internalType": "struct LiquidityController.Milestone[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "guardianOracle",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "projectToken", "type": "address" },
            { "internalType": "address", "name": "lpToken", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint256[]", "name": "unlockTimestamps", "type": "uint256[]" },
            { "internalType": "uint256[]", "name": "unlockAmounts", "type": "uint256[]" }
        ],
        "name": "lockLP",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "locks",
        "outputs": [
            { "internalType": "address", "name": "deployer", "type": "address" },
            { "internalType": "address", "name": "lpToken", "type": "address" },
            { "internalType": "uint256", "name": "totalLocked", "type": "uint256" },
            { "internalType": "uint256", "name": "totalUnlocked", "type": "uint256" },
            { "internalType": "bool", "name": "emergencyFrozen", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "projectToken", "type": "address" },
            { "internalType": "uint256", "name": "milestoneIndex", "type": "uint256" },
            { "internalType": "uint256", "name": "healthScore", "type": "uint256" },
            { "internalType": "bytes", "name": "signature", "type": "bytes" }
        ],
        "name": "processUnlock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_oracle", "type": "address" }],
        "name": "setOracle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

export const LIQUIDITY_CONTROLLER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as const;
