import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column } from 'typeorm';
import { Activity } from './activity.entity';

@ObjectType()
@ChildEntity()
export class ActivityTransfer extends Activity {
  @Field({nullable: true})
  @Column({
    type: 'varchar',
    nullable: true
  })
  tokenId: string;

  @Field({nullable: true})
  @Column({
    type: 'varchar',
    nullable: true
  })
  value: string;

  @Field({nullable: true})
  @Column({
    type: 'varchar',
    nullable: true
  })
  from: string;

  @Field({nullable: true})
  @Column({
    type: 'varchar',
    nullable: true
  })
  owner: string;

  @Field({nullable: true})
  @Column({
    type: 'varchar',
    nullable: true
  })
  contract: string;

  @Field({nullable: true})
  @Column({
    type: 'varchar',
    nullable: true
  })
  transactionHash: string;

  @Field({nullable: true})
  @Column({
    type: 'boolean',
    nullable: true
  })
  purchase: boolean;

  @Field({nullable: true})
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true
  })
  itemId: string;
}
