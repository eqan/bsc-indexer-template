import { keccak256 } from '@ethersproject/keccak256';
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity';
import { verifyMessage } from '@ethersproject/wallet';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

import { getPrivateKey, getPublicKey } from 'src/common/utils.common';
import { Data } from 'src/graphqlFile';
import { CreateOrdersInput } from './dto/create-orders.input';
import { MakeType } from './dto/nestedObjectsDto/make-type.dto';
import { Make } from './dto/nestedObjectsDto/make.dto';

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

const ORDER_TYPEHASH = keccak256(
  'Order(address maker,Asset makeAsset,address taker,Asset takeAsset,uint256 salt,uint256 start,uint256 end,bytes4 dataType,bytes data)Asset(AssetType assetType,uint256 value)AssetType(bytes4 assetClass,bytes data)',
);

const ASSET_TYPEHASH = keccak256(
  'Asset(AssetType assetType,uint256 value)AssetType(bytes4 assetClass,bytes data)',
);

const ASSET_TYPE_TYPEHASH = solidityKeccak256(
  ['bytes32'],
  ['AssetType(bytes4 assetClass,bytes data)'],
);

const assetHash = (asset: Make) =>
  solidityKeccak256(
    ['bytes32', 'bytes32', 'uint'],
    [ASSET_TYPEHASH, assetTypeHash(asset.assetType), asset.value],
  );

const assetTypeHash = (assetType: MakeType) => {
  const data = { tokenId: assetType.tokenId, contract: assetType.contract };
  return solidityKeccak256(
    ['bytes32'],
    [
      ASSET_TYPE_TYPEHASH,
      assetType.type,
      solidityKeccak256(['tuple(uint tokenId,string contract) data'], [data]),
    ],
  );
};

const hashData = (data: Data) =>
  solidityKeccak256(
    ['tuple(string type, tuple(string account,value uint) originFees) data'],
    [data],
  );

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
    // await isSigner(this.ethereum, order.maker, hash, order.signature!)
    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    throw new BadRequestException(`error occured while decrypting : ${error}`);
  }
};

/**
 * VerifyOrder
 * @param order
 * @returns true if order is verified
 */
export const verifyOrder = (order: CreateOrdersInput): string | boolean => {
  try {
    // const message = orderToStruct(ethereum, order);
    // const decryptedData = decryptSignature(signature);
    const hash = solidityKeccak256(
      [
        'bytes32',
        'address',
        'bytes32',
        'address',
        'bytes32',
        'uint',
        'uint',
        'uint',
        'bytes4',
        'bytes',
      ],
      [
        ORDER_TYPEHASH,
        order.maker,
        assetHash(order.Make),
        order.taker,
        assetHash(order.take),
        order.salt,
        order.startedAt,
        order.endedAt,
        order.dataType,
        hashData(order.data),
      ],
    );

    const signer = verifyMessage(hash, order.signature);
    if (signer != order.maker) return false;
    return signer;

    // assert.deepEqual(
    //   actualData,
    //   decryptedData,
    //   'Decrypted data is different from actual',
    // );
  } catch (error) {
    // console.log('error while validation', error);
    throw new BadRequestException(error);
  }
};

// export function orderToStruct(
//   ethereum: Ethereum,
//   order: SimpleRaribleV2Order,
//   wrongEncode = false,
// ): any {
//   const [dataType, data] = encodeRaribleV2OrderData(
//     ethereum,
//     order.data,
//     wrongEncode,
//   );
//   return {
//     maker: order.maker,
//     makeAsset: assetToStruct(ethereum, order.make),
//     taker: order.taker ?? ZERO_ADDRESS,
//     takeAsset: assetToStruct(ethereum, order.take),
//     salt: order.salt,
//     start: order.start ?? 0,
//     end: order.end ?? 0,
//     dataType,
//     data,
//   };
// }
