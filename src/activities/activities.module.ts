import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesResolver } from './activities.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityTransfer } from './entities/activity.transfer.entity';
import { ActivityMint } from './entities/activity.mint.entity';
import { ActivityBid } from './entities/activity.bid.entity';
import { ActivityBurn } from './entities/activity.burn.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      ActivityTransfer,
      ActivityMint,
      ActivityBid,
      ActivityBurn,
    ]),
  ],
  providers: [ActivitiesResolver, ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
