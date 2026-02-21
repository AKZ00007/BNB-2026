export const GUARDIAN_FACTORY_ABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "maxWalletPct", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "antiBotBlocks", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "buyTaxBps", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "sellTaxBps", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "cooldownSec", "type": "uint256" }
        ],
        "name": "TokenCreated",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "name_", "type": "string" },
            { "internalType": "string", "name": "symbol_", "type": "string" },
            { "internalType": "uint256", "name": "totalSupply_", "type": "uint256" },
            { "internalType": "uint256", "name": "maxWalletPct_", "type": "uint256" },
            { "internalType": "uint256", "name": "antiBotBlocks_", "type": "uint256" },
            { "internalType": "uint256", "name": "buyTaxBps_", "type": "uint256" },
            { "internalType": "uint256", "name": "sellTaxBps_", "type": "uint256" },
            { "internalType": "uint256", "name": "cooldownSec_", "type": "uint256" },
            { "internalType": "address", "name": "taxReceiver_", "type": "address" }
        ],
        "name": "createGuardianToken",
        "outputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

// Placeholder address until actually deployed to testnet
export const GUARDIAN_FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;
