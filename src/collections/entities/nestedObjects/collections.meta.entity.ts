import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';
import { Content } from './collections.meta.content.entity';

@ObjectType('CollectionsMeta')
@InputType('CollectionsMetaInput')
export class CollectionsMeta {
  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  description: string;

  @IsOptional()
  @Field(() => Content)
  @Column({ nullable: true, type: 'jsonb' })
  Content: Content;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  externalLink?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  sellerFeeBasisPoints?: number;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  feeRecipient?: string;
}
