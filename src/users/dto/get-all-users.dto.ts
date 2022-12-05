import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Users } from '../entities/users.entity';

@ObjectType('GetAllUsers')
export class GetAllUsers {
  @Field(() => [Users])
  items: Users[];

  @Field(() => Int)
  total: number;
}
