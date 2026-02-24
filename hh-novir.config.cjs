// Minimal Hardhat config - compile ONLY GuardianToken, NO viaIR
// GuardianFactory requires viaIR but GuardianToken doesn't — so we exclude it
require("dotenv").config({ path: ".env.local" });

module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            // viaIR intentionally omitted — BscScan single-file verification supports this
        },
    },
    paths: {
        sources: "./contracts-token-only",
        artifacts: "./artifacts-novir",
        cache: "./cache-novir",
    },
};
