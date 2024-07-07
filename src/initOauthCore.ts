import OauthCore from '@zk-email/ts-sdk/src/oauthClient';
import { PublicClient, Address, createPublicClient, http } from '@zk-email/ts-sdk/node_modules/viem';
import { mainnet,  } from '@zk-email/ts-sdk/node_modules/viem/chains';

// 必要なパラメータを設定
const client: PublicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
});
const coreAddress: Address = '0x0'; // 実際のアドレスに置き換えてください
const ioauthAddress: Address = '0x0'; // 実際のアドレスに置き換えてください
const relayerHost: string = 'https://relayer.example.com';

// OauthCore クラスのインスタンスを初期化
const oauthCore = new OauthCore(client, coreAddress, ioauthAddress, relayerHost);

// 必要に応じて、初期化後の処理を追加
console.log('OauthCore initialized:', oauthCore);