// generate-contract-ts.mjs
import { readFileSync, writeFileSync } from 'fs';

const artifact = JSON.parse(
    readFileSync('./artifacts/contracts/SimpleToken.sol/SimpleToken.json', 'utf8')
);

const ts = `/**
 * SimpleToken — compiled artifact
 * Source: contracts/SimpleToken.sol
 * Compiler: solc 0.8.20, optimizer 200 runs
 * Constructor: (string name_, string symbol_, uint256 totalSupplyWhole)
 * totalSupplyWhole = whole tokens (multiplied by 10^18 inside the contract)
 */

export const SIMPLE_TOKEN_ABI = ${JSON.stringify(artifact.abi, null, 2)} as const;

export const SIMPLE_TOKEN_BYTECODE = "${artifact.bytecode}" as \`0x\${string}\`;
`;

writeFileSync('./lib/contracts/SimpleToken.ts', ts, 'utf8');
console.log('✅ SimpleToken.ts generated. Bytecode length:', artifact.bytecode.length);
