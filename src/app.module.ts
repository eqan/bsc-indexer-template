import { ApolloDriver } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ActivityModule } from 'src/activity/activity.module';
import { AuctionsModule } from 'src/auctions/auctions.module';
import { CollectionsModule } from 'src/collections/collections.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { BlockchainConfig } from 'src/config/blockchain.config';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { OrdersModule } from 'src/orders/orders.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { BullConfig } from './config/bull.config';
import { SyncEventsModule } from './events/sync-events/sync-events.module';
import { BackfillSyncModule } from './jobs/backfill-sync/backfill-sync.job.module';
import { RealtimeSyncModule } from './jobs/realtime-sync/realtime-sync.job.module';
import { MidwaySyncModule } from './jobs/midway-sync/midway-sync.job.module';

@Module({
  imports: [
    /**
     * GraphQl Module
     * GraphQl Configuration
     */
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
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
    /**
     * CacheModule
     * Cache Configuration using in-memory caching
     */
    // CacheModule.register({ isGlobal: true }),
    // CacheModule.register<ClientOpts>({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: 'localhost',
    //   port: 6379,
    // }),
    CollectionsModule,
    TokensModule,
    ActivityModule,
    OrdersModule,
    RpcProviderModule,
    MetadataApiModule,
    AuctionsModule,
    //Jobs Module
    RealtimeSyncModule,
    SyncEventsModule,
    MidwaySyncModule,
    BackfillSyncModule,
  ],
})
export class AppModule {}
