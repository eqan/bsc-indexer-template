import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as assert from 'node:assert';
import * as path from 'path';
import {
  PATH_TO_PRIVATE_KEY,
  PATH_TO_PUBLIC_KEY,
} from 'src/common/utils.common';

/**
 * Generate Signature
 * @param data
 * @returns signature
 */
export const generateSignature = (data: any): string => {
  try {
    const absolutePath = path.resolve(PATH_TO_PUBLIC_KEY);
    const publicKey = fs.readFileSync(absolutePath, 'utf8');
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
    const absolutePath = path.resolve(PATH_TO_PRIVATE_KEY);
    const privateKey = fs.readFileSync(absolutePath, 'utf8');
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
