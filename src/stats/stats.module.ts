import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from 'src/collections/collections.module';
import { Stats } from './entities/stats.entity';
import { StatsResolver } from './stats.resolver';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stats]), CollectionsModule],
  providers: [StatsResolver, StatsService],
  exports: [StatsService],
})
export class StatsModule {}
