import { registerEnumType } from '@nestjs/graphql';

export enum QueueType {
  REAL_TIME_CRON = 'REAL_TIME_CRON',
  BACKFILL_CRON = 'BACKFILL_CRON',
  REALTIME_QUEUE = 'REALTIME_SYNC_EVENTS',
  BACKFILL_QUEUE = 'BACKFILL_SYNC_EVENTS',
  MIDWAY_QUEUE = 'MIDWAY_SYNC_EVENTS',
  FETCH_METADATA_QUEUE = 'FETCH_METADATA',
}

registerEnumType(QueueType, {
  name: 'QueueTypeEnum',
});
