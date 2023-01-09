import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from 'src/collections/collections.module';
import { Collections } from 'src/collections/entities/collections.entity';
import { CollectionsMeta } from 'src/collections/entities/nestedObjects/collections.meta.entity';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { CollectionsRegistrationService } from './collectionRegistration.service';

@Module({
  imports: [
    RpcProviderModule,
    TypeOrmModule.forFeature([Collections, CollectionsMeta]),
    forwardRef(() => CollectionsModule),
  ],
  providers: [CollectionsRegistrationService],
  exports: [CollectionsRegistrationService],
})
export class CollectionsRegistrationModule {}
