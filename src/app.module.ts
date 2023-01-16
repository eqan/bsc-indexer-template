import { ApolloDriver } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { response } from 'express';
import { join } from 'path';
import { BlockchainConfig } from 'src/config/blockchain.config';
import { ActivitiesModule } from './activities/activities.module';
import { AuctionsModule } from './auctions/auctions.module';
import { CollectionsModule } from './collections/collections.module';
import { StatsModule } from './stats/stats.module';
import { RpcProviderModule } from './common/rpc-provider/rpc-provider.module';
import { BullConfig } from './config/bull.config';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { CustomBigNumberScalar } from './core/customScalars/bignumber';
import { SyncEventsModule } from './events/sync-events/sync-events.module';
import { BackfillSyncModule } from './jobs/backfill-sync/backfill-sync.job.module';
import { MidwaySyncModule } from './jobs/midway-sync/midway-sync.job.module';
import { RealtimeSyncModule } from './jobs/realtime-sync/realtime-sync.job.module';
import { CustomEnumScalar } from './orders/common/orders-enum-scalar.common';
import { CustomDataScalar } from './orders/dto/nestedObjectsDto/data.dto';
import { OrdersModule } from './orders/orders.module';
import { RefreshMetadataModule } from './refresh-metadata/refresh-metadata.module';
import { TokensModule } from './tokens/tokens.module';
import { UsdPricesModule } from './usd-prices/usd-prices.module';
import { UsersModule } from './users/users.module';
import { MetadataApiModule } from './utils/metadata-api/metadata-api.module';
import { CustomAddressScalar } from './core/customScalars/address';

@Module({
  imports: [
    /**
     * GraphQl Module
     * GraphQl Configuration
     */
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      /* Union types work fine without sorting */
      // sortSchema: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      context: response,
      resolvers: {
        DATA_SCALAR: CustomDataScalar,
        ENUM_SCALAR: CustomEnumScalar,
        BigNumber: CustomBigNumberScalar,
        Address: CustomAddressScalar,
      },
      definitions: {
        path: join(process.cwd(), 'src/graphqlFile.ts'),
      },
    }),
    /**
     * TypeORM Module
     * TypeORM Configurations
     */
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    /**
     * Config Module
     * Custom Configurations Files
     */
    ConfigModule.forRoot({
      isGlobal: true,
      load: [BlockchainConfig],
    }),
    /**
     * ScheduleModule
     * Cron Job Scheduling Module
     */
    ScheduleModule.forRoot(),
    /**
     * BullModule
     * Bull Configuration
     */
    BullModule.forRootAsync({
      useClass: BullConfig,
    }),
    CollectionsModule,
    TokensModule,
    OrdersModule,
    ActivitiesModule,
    UsersModule,
    RpcProviderModule,
    MetadataApiModule,
    AuctionsModule,
    RefreshMetadataModule,
    UsdPricesModule,
    StatsModule,
    //Jobs Module
    RealtimeSyncModule,
    SyncEventsModule,
    MidwaySyncModule,
    BackfillSyncModule,
  ],
})
export class AppModule {}
