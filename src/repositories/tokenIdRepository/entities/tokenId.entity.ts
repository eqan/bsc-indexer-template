import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

/**Create tokens table in database
 *
 */
@ObjectType()
@Entity('')
export class TokenId extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  value: string;
}
