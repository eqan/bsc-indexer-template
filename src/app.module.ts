import { BlockchainConfig } from 'src/config/blockchain.config';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { CollectionsModule } from 'src/collections/collections.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { ActivityModule } from 'src/activity/activity.module';
import { OrdersModule } from 'src/orders/orders.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { AuctionsModule } from 'src/auctions/auctions.module';

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
    ActivityModule,
    OrdersModule,
    RpcProviderModule,
    MetadataApiModule,
    AuctionsModule,
  ],
})
export class AppModule {}
