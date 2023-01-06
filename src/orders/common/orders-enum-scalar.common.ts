import { GraphQLScalarType } from 'graphql';
import { isEnumValid } from 'src/common/utils.common';
import { OrderStatus } from '../entities/enums/orders.status.enum';

const validateEnumScalar = (
  status: any,
): OrderStatus[] | OrderStatus | never => {
  try {
    if (isEnumValid(status, OrderStatus)) return [status];
    else
      [...status]?.forEach((status: OrderStatus) => {
        if (!isEnumValid(status, OrderStatus))
          throw new Error('Must be a valid Array of strings Enum(OrderStatus)');
      });
    return status;
  } catch (error) {
    throw new Error(error);
  }
};

export const CustomEnumScalar = new GraphQLScalarType({
  name: 'ENUM_SCALAR',
  description: 'A simple scalar to input list of enum',
  parseValue: (value) => validateEnumScalar(value),
});
