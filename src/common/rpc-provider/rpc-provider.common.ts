import { ConfigService } from '@nestjs/config';
import {
  StaticJsonRpcProvider,
  WebSocketProvider
} from '@ethersproject/providers';
import { Global, Injectable, Logger } from '@nestjs/common';

@Injectable()
@Global()
export class RpcProvider {
  constructor(private config: ConfigService) {}

  baseNetworkHttpUrl = this.config.get('baseNetworkHttpUrl');
  chainId = this.config.get('chainId');
  baseNetworkWsUrl = this.config.get('baseNetworkWsUrl');

  private readonly logger = new Logger('websocket-provider');
  // Use a static provider to avoid redundant `eth_chainId` calls
  baseProvider = new StaticJsonRpcProvider(
    this.baseNetworkHttpUrl,
    this.chainId
  );

  // https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-808736570
  // WebSocket subscriptions to fetch the
  // latest events as soon as they're hapenning on-chain.
  safeWebSocketSubscription = (
    callback: (provider: WebSocketProvider) => Promise<void>
  ) => {
    const webSocketProvider = new WebSocketProvider(this.baseNetworkWsUrl);
    webSocketProvider.on('error', (error) => {
      this.logger.error(`WebSocket subscription failed: ${error}`);
    });

    webSocketProvider._websocket.on('error', (error: any) => {
      this.logger.error(`WebSocket subscription failed: ${error}`);
    });

    let pingTimeout: NodeJS.Timeout | undefined;
    let keepAliveInterval: NodeJS.Timer | undefined;

    const EXPECTED_PONG_BACK = 15000;
    const KEEP_ALIVE_CHECK_INTERVAL = 7500;
    webSocketProvider._websocket.on('open', async () => {
      keepAliveInterval = setInterval(() => {
        webSocketProvider._websocket.ping();

        pingTimeout = setTimeout(() => {
          webSocketProvider._websocket.terminate();
        }, EXPECTED_PONG_BACK);
      }, KEEP_ALIVE_CHECK_INTERVAL);

      await callback(webSocketProvider);
    });

    webSocketProvider._websocket.on('close', () => {
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      if (pingTimeout) {
        clearTimeout(pingTimeout);
      }
      this.safeWebSocketSubscription(callback);
    });

    webSocketProvider._websocket.on('pong', () => {
      if (pingTimeout) {
        clearInterval(pingTimeout);
      }
    });
  };
}
