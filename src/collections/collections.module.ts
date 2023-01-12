import { BigNumber } from '@ethersproject/bignumber';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenIdModule } from 'src/repositories/tokenIdRepository/tokenId.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';
import { CollectionsMeta } from './entities/nestedObjects/collections.meta.entity';
import { CollectionsRegistrationModule } from 'src/collectionRegistrationService/collectionRegistration.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { UrlServiceModule } from 'src/utils/url-service/url-service.module';
import { CollectionsMetaService } from './services/collections.meta.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collections, CollectionsMeta]),
    forwardRef(() => TokensModule),
    TokenIdModule.register(BigNumber.from(2).pow(96)),
    OrdersModule,
    forwardRef(() => CollectionsRegistrationModule),
    forwardRef(() => MetadataApiModule),
    UrlServiceModule,
  ],
  providers: [CollectionsResolver, CollectionsService, CollectionsMetaService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
