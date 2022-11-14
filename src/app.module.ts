import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    CollectionsModule,
    TokensModule,
    OrdersModule,
    ActivitiesModule,
    RpcProviderModule,
    MetadataApiModule,
    AuctionsModule,
  ],
})
export class AppModule {}
