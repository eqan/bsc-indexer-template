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
import { RpcProviderModule } from './common/rpc-provider/rpc-provider.module';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { OrdersModule } from './orders/orders.module';
import { TokensModule } from './tokens/tokens.module';
import { MetadataApiModule } from './utils/metadata-api/metadata-api.module';
import { BullConfig } from './config/bull.config';
import { SyncEventsModule } from './events/sync-events/sync-events.module';
import { BackfillSyncModule } from './jobs/backfill-sync/backfill-sync.job.module';
import { RealtimeSyncModule } from './jobs/realtime-sync/realtime-sync.job.module';
import { MidwaySyncModule } from './jobs/midway-sync/midway-sync.job.module';
import { UsersModule } from './users/users.module';
import { RefreshMetadataModule } from './refresh-metadata/refresh-metadata.module';

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
      context: response,
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
    // OrdersModule,
    ActivitiesModule,
    UsersModule,
    RpcProviderModule,
    MetadataApiModule,
    AuctionsModule,
    RefreshMetadataModule,
    //Jobs Module
    RealtimeSyncModule,
    SyncEventsModule,
    MidwaySyncModule,
    BackfillSyncModule,
  ],
})
export class AppModule {}
