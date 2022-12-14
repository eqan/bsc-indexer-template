import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from 'src/tokens/tokens.module';
import { CollectionsResolver } from './collections.resolver';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';
import { CollectionsMeta } from './entities/nestedObjects/collections.meta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collections, CollectionsMeta]),
    forwardRef(() => TokensModule),
  ],
  providers: [CollectionsResolver, CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
