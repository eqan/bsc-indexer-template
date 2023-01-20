import { Binary, toBinary } from '@rarible/types';
import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

export const CustomBinaryScalar = new GraphQLScalarType({
  name: 'Binary',
  description: 'Binary Parser',
  serialize: (value: string) => toBinary(value),
  parseValue: (value: string) => toBinary(value),
  parseLiteral: (ast: ValueNode): Binary => {
    if (ast.kind === Kind.STRING) {
      return toBinary(ast.value);
    }
    return null;
  },
});
