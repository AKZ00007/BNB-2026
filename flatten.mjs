import hre from "hardhat";
import fs from "fs";

async function main() {
    try {
        const flattened = await hre.run("flatten:get-flattened-sources", {
            files: ["contracts/GuardianToken.sol"]
        });
        // Remove duplicate SPDX identifiers which cause BscScan to fail
        const cleaned = flattened.replace(/SPDX-License-Identifier:/g, "License:");
        // Add one SPDX at the top
        const finalCode = "// SPDX-License-Identifier: MIT\n" + cleaned;

        fs.writeFileSync("flattened_token.sol", finalCode);
        console.log("Successfully wrote flattened_token.sol");
    } catch (err) {
        console.error(err);
    }
}

main();
