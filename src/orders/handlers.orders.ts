import { verifyTypedData } from '@ethersproject/wallet';
import { BadRequestException } from '@nestjs/common';
import { EIP712Domain } from '@rarible/ethereum-api-client/build/index';
import { Asset } from '@rarible/ethereum-api-client/build/models/Asset';
import {
  EIP712_DOMAIN_TEMPLATE,
  EIP712_ORDER_TYPES,
} from '@rarible/protocol-ethereum-sdk/build/order/eip712';
import { orderToStruct } from '@rarible/protocol-ethereum-sdk/build/order/sign-order';
import { SimpleRaribleV2Order } from '@rarible/protocol-ethereum-sdk/build/order/types';
import { Address, toAddress, ZERO_ADDRESS } from '@rarible/types/build/address';
import { toBigNumber } from '@rarible/types/build/big-number';
import { toWord } from '@rarible/types/build/word';
import { CreateOrdersInput } from './dto/create-orders.input';
// import { EthAssetType } from './entities/assetType';
import {
  AssetType,
  Erc20AssetType,
} from '@rarible/ethereum-api-client/build/models/AssetType';
import { OrderRaribleV2DataV1 } from '@rarible/ethereum-api-client/build/models/OrderData';
import * as web3Provider from '@rarible/ethers-ethereum';
// /**
//  * Generate Signature
//  * @param data
//  * @returns signature
//  */
// export const generateSignature = (data: string): string => {
//   try {
//     const publicKey = getPublicKey();
//     const signature = crypto.publicEncrypt(
//       publicKey,
//       Buffer.from(JSON.stringify(data)),
//     );
//     return signature.toString('base64');
//   } catch (error) {
//     throw new BadRequestException(
//       `error occured while generating signature : ${error}`,
//     );
//   }
// };

// /**
//  *  Decrypt Signature
//  * @param signature
//  * @returns decryptedData
//  */
// export const decryptSignature = (signature: string): string => {
//   try {
//     const privateKey = getPrivateKey();
//     const decrypted = crypto.privateDecrypt(
//       privateKey,
//       Buffer.from(signature, 'base64'),
//     );
//     // await isSigner(this.ethereum, order.maker, hash, order.signature!)
//     return JSON.parse(decrypted.toString('utf8'));
//   } catch (error) {
//     throw new BadRequestException(`error occured while decrypting : ${error}`);
//   }
// };

const parseAssetType = (assetType: AssetType) => {
  let data = {};
  Object.keys(assetType).forEach((key) => {
    if (key === 'contract')
      data = { ...data, contract: toAddress(assetType[key]) };
    else data = { ...data, tokenId: toBigNumber(assetType[key]) };
  });
  return data;
};

/**
 * VerifyOrder
 * @param order
 * @returns true if order is verified
 */
export const verifyOrder = (
  order: CreateOrdersInput,
  provider,
): string | boolean => {
  try {
    const assetType: Erc20AssetType = {
      assetClass: 'ERC20',
      // contract: toAddress(order.Make.assetType?.contract),
      contract: toAddress('02X464772'),
      // tokenId: toBigNumber(order.Make.assetType?.tokenId),
    };

    parseAssetType(assetType);

    const make: Asset = {
      assetType: {
        assetClass: 'ERC20',
        // contract: toAddress(order.Make.assetType?.contract),
        contract: toAddress('02X464772'),
        // tokenId: toBigNumber(order.Make.assetType?.tokenId),
      },
      value: toBigNumber(order.Make.value),
      valueDecimal: toBigNumber(order.Make?.valueDecimal),
    };

    //   const data = export declare type OrderRaribleV2DataV1 = {
    //     dataType: "RARIBLE_V2_DATA_V1";
    //     payouts: Array<Part>;
    //     originFees: Array<Part>;
    // };

    const part = {
      account: toAddress('237737'),
      value: 78,
    };

    const data: OrderRaribleV2DataV1 = {
      dataType: 'RARIBLE_V2_DATA_V1',
      payouts: [part],
      originFees: [part],
    };

    const makeOrder: SimpleRaribleV2Order = {
      type: 'RARIBLE_V2',
      maker: toAddress(order.maker),
      make: make,
      taker: toAddress(order.taker) ?? ZERO_ADDRESS,
      take: make,
      salt: toWord(order.salt),
      start: Number(order.startedAt) ?? 0,
      end: Number(order.endedAt) ?? 0,
      data: data,
    };

    // orderToStruct();

    // const message = orderToStruct(ethereum, order);
    // const decryptedData = decryptSignature(signature);
    // const hash = keccak256(
    //   defaultAbiCoder.encode(
    //     [
    //       'bytes32',
    //       'address',
    //       'bytes32',
    //       'address',
    //       'bytes32',
    //       'uint',
    //       'uint',
    //       'uint',
    //       'bytes4',
    //       'bytes',
    //     ],
    //     [
    //       ORDER_TYPEHASH,
    //       order.maker,
    //       assetHash(order.Make),
    //       order.taker,
    //       assetHash(order.take),
    //       order.salt,
    //       order.startedAt,
    //       order.endedAt,
    //       order.dataType,
    //       hashData(order.data),
    //     ],
    //   ),
    // );
    const etProvider = new web3Provider.EthersWeb3ProviderEthereum(provider);
    // etProvider

    // const hash = 'hello';
    // TypedDataUtils.sign({
    //   primaryType: EIP712_ORDER_TYPE,
    //   domain,
    //   types: EIP712_ORDER_TYPES,
    //   message: orderToStruct(ethereum, order),
    // })
    // verifyTypedData( domain , types , value , signature )
    function createEIP712Domain(
      chainId: number,
      verifyingContract: Address,
    ): EIP712Domain {
      return {
        ...EIP712_DOMAIN_TEMPLATE,
        verifyingContract: verifyingContract,
        chainId,
      };
    }
    const domain = createEIP712Domain(
      Number(process.env.CHAIN_ID),
      toAddress('0xe77713848bc4ffa4819f9c5cd2cbd90841510bbd'),
    );
    const signer = verifyTypedData(
      domain,
      EIP712_ORDER_TYPES,
      orderToStruct(etProvider, makeOrder),
      order.signature,
    );

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

// const ORDER_TYPEHASH = keccak256(
//   toUtf8Bytes(
//     'Order(address maker,Asset makeAsset,address taker,Asset takeAsset,uint256 salt,uint256 start,uint256 end,bytes4 dataType,bytes data)Asset(AssetType assetType,uint256 value)AssetType(bytes4 assetClass,bytes data)',
//   ),
// );

// const ASSET_TYPEHASH = keccak256(
//   toUtf8Bytes(
//     'Asset(AssetType assetType,uint256 value)AssetType(bytes4 assetClass,bytes data)',
//   ),
// );

// const ASSET_TYPE_TYPEHASH = keccak256(
//   toUtf8Bytes('AssetType(bytes4 assetClass,bytes data)'),
// );

// const assetHash = (asset: Make) =>
//   keccak256(
//     defaultAbiCoder.encode(
//       ['bytes32', 'bytes32', 'uint'],
//       [ASSET_TYPEHASH, assetTypeHash(asset.assetType), asset.value],
//     ),
//   );

// const assetTypeHash = (assetType: MakeType) => {
//   return keccak256(
//     defaultAbiCoder.encode(
//       ['bytes32', 'bytes4', 'bytes32'],
//       [
//         ASSET_TYPE_TYPEHASH,
//         assetType.type,
//         keccak256(
//           defaultAbiCoder.encode(
//             ['tuple(string type,string contract,uint tokenId) assetType'],
//             [assetType],
//           ),
//         ),
//       ],
//     ),
//   );
// };

// const hashData = (data: Data) => {
//   return keccak256(
//     defaultAbiCoder.encode(
//       ['tuple(bytes type, tuple(string account,uint value) originFees) data'],
//       [data],
//     ),
//   );
// };
