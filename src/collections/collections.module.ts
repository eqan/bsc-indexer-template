import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collections])],
  providers: [CollectionsResolver, CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
