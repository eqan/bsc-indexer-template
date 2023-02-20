import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Orders } from 'src/orders/entities/orders.entity';
import { convertDataToBinary } from 'src/utils/service/sign-extension';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { keccak256 } from 'js-sha3';
import { PreparedTransaction } from './dto/preparedtx.dto';
import { utils } from 'ethers';
import * as ABI from '../contracts/ExchangeV2.json';

@Injectable()
export class PrepareTransactionService {
  private readonly logger = new Logger('approve-service');

  async prepareCancelTxData(order: Orders): Promise<PreparedTransaction> {
    try {
      // val orderKey = order.forV1Tx()._1()
      // return PreparedTx(exchangeContractAddresses.v1, ExchangeV1.cancelSignature().encode(orderKey))
      const dataToHash = `${order.contract}${order.tokenId}`;
      const hashData = solidityKeccak256(
        ['bytes'],
        ['0x' + keccak256(dataToHash)],
      );
      const orderKey = convertDataToBinary(hashData);
      const abiArray = ABI.abi as any[];
      const iface = new utils.Interface(abiArray);
      const encodedData = iface.encodeFunctionData('cancel', [orderKey]);
      console.log('This is encoded data', encodedData);
      return {
        to: '0x9757F2d2b135150BBeb65308D4a91804107cd8D6',
        data: encodedData,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
