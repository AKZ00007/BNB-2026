/**
 * BscScan API Client
 * Fetches token contract data from BSC blockchain
 * Rate limit: 5 calls/sec (free tier)
 */

const BSCSCAN_BASE_URL = 'https://api.bscscan.com/api';

interface BscScanTokenTx {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    from: string;
    contractAddress: string;
    to: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
}

interface BscScanContractInfo {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
}

export interface TokenInfo {
    contractAddress: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: number;
    totalSupply: string;
    isVerified: boolean;
    creationDate: Date | null;
}

/**
 * Sleep helper for rate limiting
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Make a rate-limited request to BscScan
 */
async function bscScanRequest(params: Record<string, string>): Promise<unknown> {
    const apiKey = process.env.BSCSCAN_API_KEY;
    if (!apiKey) {
        throw new Error('BSCSCAN_API_KEY environment variable is not set');
    }

    const url = new URL(BSCSCAN_BASE_URL);
    url.searchParams.set('apikey', apiKey);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`BscScan API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === '0' && data.message === 'NOTOK') {
        throw new Error(`BscScan API error: ${data.result}`);
    }

    // Rate limit: wait 200ms between calls (5/sec)
    await sleep(200);

    return data.result;
}

/**
 * Get recently created token contracts (BEP-20)
 * Uses the token transfer events to discover new tokens
 */
export async function getRecentTokens(
    fromBlock: number = 0,
    toBlock: string = 'latest',
    page: number = 1,
    offset: number = 100
): Promise<BscScanTokenTx[]> {
    // Use the "tokentx" action to find recent token creation events
    // We look for transfers FROM the zero address (0x0000...) which indicates minting
    const result = await bscScanRequest({
        module: 'account',
        action: 'tokentx',
        address: '0x0000000000000000000000000000000000001004', // BSC system contract (token hub)
        startblock: fromBlock.toString(),
        endblock: toBlock,
        page: page.toString(),
        offset: offset.toString(),
        sort: 'desc',
    });

    return (result as BscScanTokenTx[]) || [];
}

/**
 * Get token total supply
 */
export async function getTokenTotalSupply(contractAddress: string): Promise<string> {
    const result = await bscScanRequest({
        module: 'stats',
        action: 'tokensupply',
        contractaddress: contractAddress,
    });

    return result as string;
}

/**
 * Check if a contract is verified on BscScan
 */
export async function isContractVerified(contractAddress: string): Promise<boolean> {
    try {
        const result = await bscScanRequest({
            module: 'contract',
            action: 'getabi',
            address: contractAddress,
        });
        return typeof result === 'string' && result !== 'Contract source code not verified';
    } catch {
        return false;
    }
}

/**
 * Get contract source code info
 */
export async function getContractInfo(contractAddress: string): Promise<BscScanContractInfo | null> {
    try {
        const result = await bscScanRequest({
            module: 'contract',
            action: 'getsourcecode',
            address: contractAddress,
        });
        const infos = result as BscScanContractInfo[];
        return infos?.[0] || null;
    } catch {
        return null;
    }
}

/**
 * Get the creation transaction of a contract
 */
export async function getContractCreationDate(contractAddress: string): Promise<Date | null> {
    try {
        const result = await bscScanRequest({
            module: 'contract',
            action: 'getcontractcreation',
            address: contractAddress,
        });
        const creations = result as Array<{ contractAddress: string; contractCreator: string; txHash: string }>;
        if (creations?.[0]?.txHash) {
            // Get the transaction to find the timestamp
            const txResult = await bscScanRequest({
                module: 'proxy',
                action: 'eth_getTransactionByHash',
                txhash: creations[0].txHash,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tx = txResult as any;
            if (tx?.blockNumber) {
                const blockResult = await bscScanRequest({
                    module: 'proxy',
                    action: 'eth_getBlockByNumber',
                    tag: tx.blockNumber,
                    boolean: 'false',
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const block = blockResult as any;
                if (block?.timestamp) {
                    return new Date(parseInt(block.timestamp, 16) * 1000);
                }
            }
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Get BNB balance of a contract (proxy for liquidity check)
 */
export async function getContractBnbBalance(contractAddress: string): Promise<number> {
    try {
        const result = await bscScanRequest({
            module: 'account',
            action: 'balance',
            address: contractAddress,
            tag: 'latest',
        });
        return parseInt(result as string) / 1e18; // Convert from wei to BNB
    } catch {
        return 0;
    }
}

/**
 * Get current BNB price in USD
 */
export async function getBnbPrice(): Promise<number> {
    try {
        const result = await bscScanRequest({
            module: 'stats',
            action: 'bnbprice',
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return parseFloat((result as any)?.ethusd || '0');
    } catch {
        return 0;
    }
}
