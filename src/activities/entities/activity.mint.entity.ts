import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column } from 'typeorm';
import { Activity } from './activity.entity';

@ObjectType()
@ChildEntity()
export class ActivityMint extends Activity {
  @Field()
  @Column({
    type: 'varchar',
  })
  tokenId?: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  value?: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  owner?: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  contract?: string;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  transactionHash?: string;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
  })
  itemId?: string;
}
