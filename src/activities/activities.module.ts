import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesResolver } from './activities.resolver';
import { ActivitiesService } from './activities.service';
import { ActivityBid } from './entities/activity.bid.entity';
import { ActivityBurn } from './entities/activity.burn.entity';
import { Activity } from './entities/activity.entity';
import { ActivityMint } from './entities/activity.mint.entity';
import { ActivityTransfer } from './entities/activity.transfer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      ActivityTransfer,
      ActivityMint,
      ActivityBurn,
      ActivityBid,
    ]),
  ],
  providers: [ActivitiesResolver, ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
