import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ActivityModule } from './activity/activity.module';
import { CollectionsModule } from './collections/collections.module';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { OrdersModule } from './orders/orders.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersService } from './users/users.service';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CollectionsModule,
    TokensModule,
    ActivityModule,
    OrdersModule,
  ],
  providers: [UsersService],
})
export class AppModule {}
