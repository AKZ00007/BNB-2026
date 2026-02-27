import { createPublicClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';

const client = createPublicClient({ chain: bscTestnet, transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/') });

client.readContract({
    address: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
    abi: [{ name: 'getPair', type: 'function', stateMutability: 'view', inputs: [{ type: 'address' }, { type: 'address' }], outputs: [{ type: 'address' }] }],
    functionName: 'getPair',
    args: ['0x1FfC364A0082E5F935CAdb7A944f2a22b05bCBba', '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd']
}).then(console.log).catch(console.error);
