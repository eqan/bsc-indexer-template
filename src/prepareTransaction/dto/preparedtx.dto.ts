import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PreparedTransaction {
  @Field(() => String)
  to: string;

  @Field(() => String)
  data: string;
}
