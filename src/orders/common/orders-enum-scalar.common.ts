import { GraphQLScalarType } from 'graphql';
import { OrderStatus } from '../entities/enums/orders.status.enum';

const validateEnumScalar = (
  value: any,
): OrderStatus[] | OrderStatus | never => {
  try {
    if (Object.values(OrderStatus)?.includes(value)) return [value];
    else
      [...value]?.forEach((status: OrderStatus) => {
        if (!Object.values(OrderStatus)?.includes(status))
          throw new Error('Must be a valid Array of strings Enum(OrderStatus)');
      });
    return value;
  } catch (error) {
    throw new Error(error);
  }
};

export const CustomEnumScalar = new GraphQLScalarType({
  name: 'ENUM_SCALAR',
  description: 'A simple scalar to input list of enum',
  parseValue: (value) => validateEnumScalar(value),
});
