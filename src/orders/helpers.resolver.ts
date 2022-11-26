import { BadRequestException } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { CreateSignatureInput } from './dto/helpers.order.dto';
import { generateSignature } from './helper.orders';

@ObjectType()
class SignatureType {
  @Field()
  signature: string;
}

/**
 * Resolver for generating signature for testing of order creation
 * will be removed after actuall implementation
 * when siganture will come from frontend
 */
@Resolver()
export class HelpersResolver {
  /**
   * Create Signature
   * @param createSignatureInput
   * @returns Orders
   */
  @Mutation(() => SignatureType, { name: 'CreateSignature' })
  createSignature(
    @Args('CreatSignatureInput') createSignatureInput: CreateSignatureInput,
  ): SignatureType {
    try {
      const encyptedSignature = generateSignature(createSignatureInput);
      return { signature: encyptedSignature };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
