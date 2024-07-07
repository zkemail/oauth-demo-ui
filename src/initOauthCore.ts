import OauthCore from '@zk-email/ts-sdk/src/oauthClient';
import { PublicClient, Address, createPublicClient, http } from '@zk-email/ts-sdk/node_modules/viem';
import { mainnet,  } from '@zk-email/ts-sdk/node_modules/viem/chains';

const client: PublicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
});
const coreAddress: Address = '0x0'; 
const ioauthAddress: Address = '0x0'; 
const relayerHost: string = 'https://relayer.example.com';

const oauthCore = new OauthCore(client, coreAddress, ioauthAddress, relayerHost);

console.log('OauthCore initialized:', oauthCore);