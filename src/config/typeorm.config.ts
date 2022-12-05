import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ActivityBid } from 'src/activities/entities/activity.bid.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { Auction } from 'src/auctions/entities/auction.entity';
import { Collections } from 'src/collections/entities/collections.entity';
import { Orders } from 'src/orders/entities/orders.entity';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { Users } from 'src/users/entities/users.entity';

export default class TypeOrmConfig {
  static getOrmConfig(config: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: config.get('POSTGRES_HOST'),
      port: parseInt(config.get('POSTGRES_PORT')),
      username: config.get('DB_USER'),
      password: config.get('POSTGRES_PASSWORD'),
      database: config.get('POSTGRES_DB'),
      entities: [Tokens, Collections, Orders, Activity, Users, Auction],
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
