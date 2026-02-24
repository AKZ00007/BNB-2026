import { ethers } from "ethers";

// Using a clean valid address format to bypass checksum errors
const cleanAddress = "0x969de391a2c54a5bc12674e2acdb62da92404a81";

const args = [
    "AIBotShield", // name_
    "AIBS", // symbol_
    1000000000, // totalSupplyWhole - 1 Billion (as per the wizard input)
    2, // maxWalletPct (2%)
    3, // antiBotBlocks
    500, // buyTaxBps_ (5%)
    500, // sellTaxBps_ (5%)
    60, // cooldownSec
    cleanAddress // taxReceiver_
];

const abi = [
    "constructor(string name_, string symbol_, uint256 totalSupplyWhole, uint256 maxWalletPct, uint256 antiBotBlocks, uint256 buyTaxBps_, uint256 sellTaxBps_, uint256 cooldownSec, address taxReceiver_)"
];

const iface = new ethers.Interface(abi);

try {
    const encoded = iface.encodeDeploy(args);
    console.log("--------------------------------------------------");
    console.log("ABI Encoded Constructor Arguments:");
    console.log("--------------------------------------------------");
    // Remove the '0x' prefix for BscScan
    console.log(encoded.substring(2));
    console.log("--------------------------------------------------");
} catch (e) {
    console.error("Encoding error:", e);
}
