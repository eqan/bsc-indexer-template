import { Module } from '@nestjs/common';
import { CollectionssService } from './collectionss.service';
import { CollectionssResolver } from './collectionss.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collectionss } from './entities/collectionss.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collectionss])],
  providers: [CollectionssResolver, CollectionssService],
})
export class CollectionssModule {}
