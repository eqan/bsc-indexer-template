import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as assert from 'node:assert';
import { getPrivateKey, getPublicKey } from 'src/common/utils.common';

/**
 * Generate Signature
 * @param data
 * @returns signature
 */
export const generateSignature = (data: string): string => {
  try {
    const publicKey = getPublicKey();
    const signature = crypto.publicEncrypt(
      publicKey,
      Buffer.from(JSON.stringify(data)),
    );
    return signature.toString('base64');
  } catch (error) {
    throw new BadRequestException(
      `error occured while generating signature : ${error}`,
    );
  }
};

/**
 *  Decrypt Signature
 * @param signature
 * @returns decryptedData
 */
export const decryptSignature = (signature: string): string => {
  try {
    const privateKey = getPrivateKey();
    const decrypted = crypto.privateDecrypt(
      privateKey,
      Buffer.from(signature, 'base64'),
    );
    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    throw new BadRequestException(`error occured while decrypting : ${error}`);
  }
};

/**
 * VerifyOrder
 * @param actualData
 * @param signature
 * @returns true if order is verified
 */
export const verifyOrder = (actualData: any, signature: string): boolean => {
  try {
    const decryptedData = decryptSignature(signature);
    assert.deepEqual(
      actualData,
      decryptedData,
      'Decrypted data is different from actual',
    );
    return true;
  } catch (error) {
    return false;
  }
};
