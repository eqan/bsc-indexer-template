import { verifyMessage } from '@ethersproject/wallet';
import { BadRequestException } from '@nestjs/common';

export const verifyOrder = async (
  orderId: string,
  signature: string,
  salt: string,
) => {
  try {
    const verified = verifyMessage(salt, signature);
    console.log(verified);
    if (verified != orderId) {
      return false;
    }
    return verified;
  } catch (error) {
    throw new BadRequestException(error);
  }
};
