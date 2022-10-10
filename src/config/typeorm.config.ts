import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Collectionss } from 'src/collectionss/entities/collectionss.entity';

// export default class TypeOrmConfig {
//   static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
//     return {
//       type: 'postgres',
//       host: configService.get('POSTGRES_HOST'),
//       port: configService.get('POSTGRES_PORT'),
//       username: configService.get('POSTGRES_USER_NAME'),
//       password: configService.get('POSTGRES_PASSWORD'),
//       database: configService.get('POSTGRES_DB'),
//       entities: [Collectionss],
//       synchronize: true,
//     };
//   }
// }

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  // imports: [ConfigModule],
  // useFactory: async (
  //   configService: ConfigService,
  // ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  // inject: [ConfigService],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('POSTGRES_HOST'),
    port: parseInt(config.get('POSTGRES_PORT')),
    username: config.get('DB_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    database: config.get('POSTGRES_DB'),
    entities: [Collectionss],
    synchronize: true,
  }),
};
