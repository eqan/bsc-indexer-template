import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';
import { Content } from './collections.meta.content.entity';

@ObjectType('CollectionsMeta')
@InputType('CollectionsMetaInput')
export class CollectionsMeta {
  @Field({ nullable: true })
  @Column('text')
  name: string;

  @Field({ nullable: true })
  @Column('text')
  description: string;

  @IsOptional()
  @Field(() => Content, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  Content: Content;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  externalLink?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  sellerFeeBasisPoints?: number;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  feeRecipient?: string;
}
