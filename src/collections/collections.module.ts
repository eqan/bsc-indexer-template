import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsResolver } from './collections.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collections } from './entities/collections.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collections])],
  providers: [CollectionsResolver, CollectionsService],
})
export class CollectionsModule {}
