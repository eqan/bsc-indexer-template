import { GraphQLScalarType } from 'graphql';
import {
  dataValidationSchema,
  validate,
} from 'src/orders/constants/orders.constants.validation-schema';

export const CustomDataScalar = new GraphQLScalarType({
  name: 'DATA_SCALAR',
  description: 'A simple Data Parser',
  serialize: (value) => validate(value, dataValidationSchema),
  parseValue: (value) => validate(value, dataValidationSchema),
});
