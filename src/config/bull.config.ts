import { ConfigService } from '@nestjs/config';
import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BullConfig implements SharedBullConfigurationFactory {
  constructor(private config: ConfigService) {}
  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: {
        password: this.config.get('REDIS_PASSWORD'),
        host: this.config.get('REDIS_HOST'),
        port: +this.config.get('REDIS_PORT'),
      },
    };
  }
}

export const queues = [{ name: 'message' }];
