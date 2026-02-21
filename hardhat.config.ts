import type { HardhatUserConfig } from "hardhat/config";

// No plugins — just base Hardhat compiler
const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            viaIR: true,
            optimizer: { enabled: true, runs: 200 },
        },
    },
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
    },
};

export default config;
