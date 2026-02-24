import { NextResponse } from 'next/server';

const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || '';
const BSCSCAN_BASE = 'https://api-testnet.bscscan.com/api'; // testnet

interface ScanCheck {
    name: string;
    passed: boolean;
    severity: 'critical' | 'warning' | 'info';
    detail: string;
}

/**
 * POST /api/scanner
 * Body: { contractAddress: string }
 * 
 * Performs real on-chain heuristic analysis of a BEP-20 token contract
 * using BscScan API data. Mimics how GoPlus / TokenSniffer work:
 * pattern detection on source code, not full symbolic execution.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { contractAddress } = body;

        if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
            return NextResponse.json({ error: 'Valid contract address required' }, { status: 400 });
        }

        const checks: ScanCheck[] = [];

        // ─── 1. Fetch contract source code from BscScan ─────────────────
        let sourceCode = '';
        let contractName = '';
        let isVerified = false;

        try {
            const sourceRes = await fetch(
                `${BSCSCAN_BASE}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${BSCSCAN_API_KEY}`
            );
            const sourceData = await sourceRes.json();

            if (sourceData.status === '1' && sourceData.result?.[0]) {
                const src = sourceData.result[0];
                sourceCode = (src.SourceCode || '').toLowerCase();
                contractName = src.ContractName || 'Unknown';
                isVerified = !!src.SourceCode && src.SourceCode.length > 10;
            }
        } catch (e) {
            console.error('BscScan source fetch error:', e);
        }

        // ─── 2. Source Verified Check ────────────────────────────────────
        checks.push({
            name: 'Source Code Verified',
            passed: isVerified,
            severity: isVerified ? 'info' : 'critical',
            detail: isVerified
                ? `Contract "${contractName}" is verified on BscScan`
                : 'Source code NOT verified — cannot audit. High risk of honeypot.'
        });

        // ─── 3. Hidden Tax / Fee Functions ──────────────────────────────
        const taxPatterns = [
            'settaxfee', 'setfee', 'settax', 'updatefee', 'updatetax',
            'settaxpercent', 'setselltax', 'setbuytax', 'changetax',
            'setmarketingfee', 'setliquidityfee', 'settreasuryfe'
        ];
        const foundTaxFns = taxPatterns.filter(p => sourceCode.includes(p));
        const hasMutableTax = foundTaxFns.length > 0;

        // Check if tax values are hardcoded high  
        const highTaxPattern = /fee\s*=\s*([2-9]\d|[1-9]\d{2,})/;
        const hasHighTax = highTaxPattern.test(sourceCode);

        checks.push({
            name: 'Hidden Tax Analysis',
            passed: !hasMutableTax || !hasHighTax,
            severity: (hasMutableTax && hasHighTax) ? 'critical' : hasMutableTax ? 'warning' : 'info',
            detail: !isVerified
                ? 'Cannot analyze — source not verified'
                : hasMutableTax
                    ? `Found ${foundTaxFns.length} mutable tax function(s): ${foundTaxFns.slice(0, 3).join(', ')}${hasHighTax ? ' — HIGH tax values detected!' : ''}`
                    : 'No mutable tax functions found. Tax is fixed at deployment.'
        });

        // ─── 4. Blacklist / Whitelist Functions ─────────────────────────
        const blacklistPatterns = [
            'blacklist', 'blocklist', 'isblacklisted', 'addtobl',
            'bannedaddress', 'isbot', 'setbot', 'antibotaddress',
            'excludefromfee', 'isexcluded'
        ];
        const foundBlacklist = blacklistPatterns.filter(p => sourceCode.includes(p));

        checks.push({
            name: 'Blacklist Function',
            passed: foundBlacklist.length === 0,
            severity: foundBlacklist.length > 0 ? 'warning' : 'info',
            detail: !isVerified
                ? 'Cannot analyze — source not verified'
                : foundBlacklist.length > 0
                    ? `Found ${foundBlacklist.length} blacklist-related function(s): ${foundBlacklist.slice(0, 3).join(', ')}`
                    : 'No blacklist or exclude functions detected.'
        });

        // ─── 5. Sell Restriction / Trading Lock ─────────────────────────
        const sellBlockPatterns = [
            'tradingenabled', 'opentrading', 'enabletrading', 'canswap',
            'swapEnabled', 'tradingactive', 'tradingopen', 'istradingopen'
        ];
        const foundSellBlock = sellBlockPatterns.filter(p => sourceCode.includes(p));

        // Check for approve() / transferFrom() traps  
        const hasTransferTrap = sourceCode.includes('require(false') ||
            sourceCode.includes('revert("no sell")') ||
            sourceCode.includes('revert("sell not allowed")');

        checks.push({
            name: 'Sell Restriction',
            passed: !hasTransferTrap,
            severity: hasTransferTrap ? 'critical' : foundSellBlock.length > 0 ? 'warning' : 'info',
            detail: !isVerified
                ? 'Cannot analyze — source not verified'
                : hasTransferTrap
                    ? 'CRITICAL: Found hard-coded sell blocking — likely honeypot!'
                    : foundSellBlock.length > 0
                        ? `Trading toggle found (${foundSellBlock[0]}). Owner can pause/enable trading.`
                        : 'No trading locks or sell restrictions detected.'
        });

        // ─── 6. Owner Mint Authority ────────────────────────────────────
        const mintPatterns = ['function mint', '_mint(msg.sender', 'mint(address', 'function createnew'];
        const foundMint = mintPatterns.filter(p => sourceCode.includes(p));
        // Check for Max Supply cap
        const hasMaxSupply = sourceCode.includes('maxsupply') || sourceCode.includes('cap') || sourceCode.includes('max_supply');

        checks.push({
            name: 'Owner Mint Authority',
            passed: foundMint.length === 0 || hasMaxSupply,
            severity: (foundMint.length > 0 && !hasMaxSupply) ? 'critical' : 'info',
            detail: !isVerified
                ? 'Cannot analyze — source not verified'
                : foundMint.length > 0
                    ? hasMaxSupply
                        ? 'Mint function exists but max supply cap is in place.'
                        : 'DANGER: Uncapped mint function found — owner can inflate supply!'
                    : 'No public mint function. Supply is fixed at deployment.'
        });

        // ─── 7. Anti-Whale Limits ───────────────────────────────────────
        const whalePatterns = [
            'maxwalletamount', 'maxbuyamount', 'maxtxamount',
            'maxwallet', 'maxtransaction', 'maxholding', '_maxwallet'
        ];
        const foundWhale = whalePatterns.filter(p => sourceCode.includes(p));

        checks.push({
            name: 'Anti-Whale Protection',
            passed: foundWhale.length > 0 || !isVerified,
            severity: isVerified && foundWhale.length === 0 ? 'warning' : 'info',
            detail: !isVerified
                ? 'Cannot analyze — source not verified'
                : foundWhale.length > 0
                    ? `Anti-whale limits detected: ${foundWhale.slice(0, 3).join(', ')}`
                    : 'No anti-whale limits found. Large buys/sells are unrestricted.'
        });

        // ─── 8. Fetch on-chain holder data ──────────────────────────────
        let topHolderPercent = 0;
        try {
            const balRes = await fetch(
                `${BSCSCAN_BASE}?module=token&action=tokenholderlist&contractaddress=${contractAddress}&page=1&offset=5&apikey=${BSCSCAN_API_KEY}`
            );
            const balData = await balRes.json();
            if (balData.status === '1' && balData.result?.length > 0) {
                // Rough check: if top holder has >50% of total supply
                const topBalance = parseFloat(balData.result[0]?.TokenHolderQuantity || '0');
                const totalSupplyRes = await fetch(
                    `${BSCSCAN_BASE}?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${BSCSCAN_API_KEY}`
                );
                const totalData = await totalSupplyRes.json();
                if (totalData.status === '1') {
                    const totalSupply = parseFloat(totalData.result || '0');
                    if (totalSupply > 0) {
                        topHolderPercent = (topBalance / totalSupply) * 100;
                    }
                }
            }
        } catch (e) {
            console.error('BscScan holder fetch error:', e);
        }

        if (topHolderPercent > 0) {
            checks.push({
                name: 'Holder Concentration',
                passed: topHolderPercent < 50,
                severity: topHolderPercent >= 50 ? 'critical' : topHolderPercent >= 30 ? 'warning' : 'info',
                detail: topHolderPercent >= 50
                    ? `Top holder owns ${topHolderPercent.toFixed(1)}% — extreme rug pull risk!`
                    : topHolderPercent >= 30
                        ? `Top holder owns ${topHolderPercent.toFixed(1)}% — elevated concentration risk`
                        : `Top holder owns ${topHolderPercent.toFixed(1)}% — reasonable distribution`
            });
        }

        // ─── Compute final score ────────────────────────────────────────
        const totalChecks = checks.length;
        const passed = checks.filter(c => c.passed).length;
        const criticalFails = checks.filter(c => !c.passed && c.severity === 'critical').length;

        let score: number;
        if (criticalFails > 0) {
            score = Math.max(5, Math.round((passed / totalChecks) * 100) - criticalFails * 20);
        } else {
            score = Math.round((passed / totalChecks) * 100);
        }

        const riskLevel = score >= 80 ? 'LOW' : score >= 50 ? 'MEDIUM' : 'HIGH';

        return NextResponse.json({
            success: true,
            contractAddress,
            contractName,
            isVerified,
            score,
            riskLevel,
            passed,
            total: totalChecks,
            checks,
        });
    } catch (error) {
        console.error('Scanner error:', error);
        return NextResponse.json(
            { error: 'Scanner failed', details: (error as Error).message },
            { status: 500 }
        );
    }
}
