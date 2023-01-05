import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { GraphQLScalarType } from 'graphql';
import { OrderStatus } from '../entities/enums/orders.status.enum';
import { PaginationParam } from './pagination.dto';

// const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// function validate(uuid: unknown): string | never {
//   if (typeof uuid !== 'string' || !regex.test(uuid)) {
//     throw new Error('invalid uuid');
//   }
//   return uuid;
// }

// export const CustomEnumScalar = new GraphQLScalarType({
//   name: 'UUID',
//   description: 'A simple UUID parser',
//   serialize: (value) => validate(value),
//   parseValue: (value) => validate(value),
//   parseLiteral: (ast) => validate(ast.value),
// });
@InputType()
export class GetSellOrdersDto extends PaginationParam {
  @IsEnum(OrderStatus)
  @IsOptional()
  @Field(() => [OrderStatus], { nullable: true })
  status?: OrderStatus[];
}
