import { toAddress, Address } from '@rarible/types';
import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

export const CustomAddressScalar = new GraphQLScalarType({
  name: 'Address',
  description: 'Address Parser',
  serialize: (value: string) => toAddress(value),
  parseValue: (value: string) => toAddress(value),
  parseLiteral: (ast: ValueNode): Address => {
    if (ast.kind === Kind.STRING) {
      return toAddress(ast.value);
    }
    return null;
  },
});
