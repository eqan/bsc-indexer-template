import { verifyMessage } from '@ethersproject/wallet';
import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { PATH_TO_PUBLIC_KEY } from 'src/common/utils.common';
import { PATH_TO_PRIVATE_KEY } from 'src/common/utils.common';
import * as assert from 'node:assert';

export const generateSignature = (data: any): string => {
  try {
    const absolutePath = path.resolve(PATH_TO_PUBLIC_KEY);
    const publicKey = fs.readFileSync(absolutePath, 'utf8');
    const signature = crypto.publicEncrypt(publicKey, Buffer.from(data));
    return signature.toString('base64');
  } catch (error) {
    console.log('error occured while generating signature', error);
  }
};

export const decryptSignature = (signature: string) => {
  try {
    const absolutePath = path.resolve(PATH_TO_PRIVATE_KEY);
    const privateKey = fs.readFileSync(absolutePath, 'utf8');
    const decrypted = crypto.privateDecrypt(
      privateKey,
      Buffer.from(signature, 'base64'),
    );
    return decrypted.toString('utf8');
  } catch (error) {
    console.log('error occured while decrypting ', error);
  }
};

export const verifyOrder = (data: any, signature: string) => {
  try {
    const decryptedData = decryptSignature(signature);
    assert.deepEqual(
      data,
      decryptedData,
      'Decrypted data is different from actuall',
    );
    return true;
  } catch (error) {
    throw new BadRequestException(error);
  }
};
