import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collections } from 'src/collections/entities/collections.entity';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { LazyTokenValidator } from './lazy-token-validator.utils';

@Module({
  imports: [RpcProviderModule, TypeOrmModule.forFeature([Collections])],
  providers: [LazyTokenValidator],
  exports: [LazyTokenValidator],
})
export class MintModule {}
