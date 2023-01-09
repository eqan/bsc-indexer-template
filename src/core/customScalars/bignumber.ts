import { toBigNumber, BigNumber } from '@rarible/types';
import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

export const CustomBigNumberScalar = new GraphQLScalarType({
  name: 'BigNumber',
  description: 'BigNumber Parser',
  serialize: (value: string) => toBigNumber(value),
  parseValue: (value: string) => toBigNumber(value),
  parseLiteral: (ast: ValueNode): BigNumber => {
    if (ast.kind === Kind.STRING) {
      return toBigNumber(ast.value);
    }
    return null;
  },
});
