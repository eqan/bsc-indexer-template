import { registerEnumType } from '@nestjs/graphql';

export enum QueueType {
  REAL_TIME_CRON = 'REAL_TIME_CRON',
  BACKFILL_CRON = 'BACKFILL_CRON',
  REALTIME_QUEUE = 'REALTIME_SYNC_EVENTS',
  BACKFILL_QUEUE = 'BACKFILL_SYNC_EVENTS',
  MIDWAY_QUEUE = 'MIDWAY_SYNC_EVENTS',
  FETCH_COLLECTIONS_QUEUE = 'FETCH_COLLECTIONS',
}

registerEnumType(QueueType, {
  name: 'QueueTypeEnum',
});

// export const realtimeQueue = 'realtime-sync-events';
// export const REAL_TIME_CRON = 'REAL_TIME_CRON';
// export const BACKFILL_CRON = 'BACKFILL_CRON';
// export const midwayQueue = 'midway-sync-events';
// export const backfillQueue = 'backfill-sync-events';
// export const fetchCollectionQueue = 'fetch-collections';
