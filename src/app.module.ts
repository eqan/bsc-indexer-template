import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BlockchainConfig } from 'src/config/blockchain.config';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { CollectionsModule } from 'src/collections/collections.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { ActivityModule } from 'src/activity/activity.module';
import { OrdersModule } from 'src/orders/orders.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { AuctionsModule } from 'src/auctions/auctions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RealtimeSyncModule } from './jobs/realtime-sync/realtime-sync.job.module';
import { BullModule } from '@nestjs/bull';
import { BullConfig } from './config/bull.config';
import { SyncEventsModule } from './events/sync-events/sync-events.module';

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
  ],
})
export class AppModule {}
