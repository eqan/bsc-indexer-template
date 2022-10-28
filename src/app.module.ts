import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuctionsModule } from 'src/auctions/auctions.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { BlockchainConfig } from 'src/config/blockchain.config';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { ActivityModule } from './activity/activity.module';
import { CollectionsModule } from './collections/collections.module';
import { OrdersModule } from './orders/orders.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

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
    UsersModule,
    RpcProviderModule,
    MetadataApiModule,
    AuctionsModule,
  ],
})
export class AppModule {}
