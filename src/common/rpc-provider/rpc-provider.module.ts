import { Global, Module } from '@nestjs/common';
import { RpcProvider } from './rpc-provider.common';

/**
 * @RpcProviderModule
 * global module that provides connection to interact with blockchain
 */
@Global()
@Module({ providers: [RpcProvider], exports: [RpcProvider] })
export class RpcProviderModule {}
