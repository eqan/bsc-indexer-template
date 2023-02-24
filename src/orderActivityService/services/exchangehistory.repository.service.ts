import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogEventDocument } from '../schemas/log-event.schema';
import { Aggregation } from 'mongoose';
import { LogEventStatus } from '../interfaces/log-event-status.enum';
import { ItemType } from '../interfaces/item-type.enum';
import { Asset } from '../interfaces/asset.interface';
import { OrderExchangeHistory } from '../interfaces/order-exchange-history.interface';
import { HistorySource } from '../interfaces/history-source.enum';
import { ItemType } from '../interfaces/item-type.enum';
import { OrderSideMatch } from '../interfaces/order-side-match.interface';
import { ActivitySort } from '../interfaces/activity-sort.interface';
import { OrderVersion } from '../interfaces/order-version.interface';
import { AggregatedData } from '../interfaces/aggregated-data.interface';
import { NftAssetType } from '../interfaces/nft-asset-type.interface';
import { EthUInt256 } from '../interfaces/eth-uint256.interface';
import { Address } from '../interfaces/address.interface';
import { LogEventShort } from '../interfaces/log-event-short.interface';

@Injectable()
export class ExchangeHistoryRepository {
  constructor(
    @InjectModel('LogEvent')
    private readonly logEventModel: Model<LogEventDocument>,
  ) {}

  async save(logEvent: LogEventShort): Promise<LogEventShort> {
    const createdLogEvent = new this.logEventModel(logEvent);
    return createdLogEvent.save();
  }

  async findById(id: string): Promise<LogEventShort> {
    return this.logEventModel.findById(id).exec();
  }

  async find(query: Aggregation): Promise<LogEventShort[]> {
    return this.logEventModel.aggregate(query).exec();
  }

  async findByItemType(type: ItemType): Promise<LogEventShort[]> {
    const query = { topic: { $in: [type.topic] } };
    return this.logEventModel.find(query).exec();
  }

  async findSellEventsByItem(
    token: Address,
    tokenId: EthUInt256,
  ): Promise<LogEventShort[]> {
    const query = {
      $and: [
        { 'data.make.type.nft': token },
        { 'data.make.type.nft.tokenId': tokenId.toString() },
        { status: LogEventStatus.CONFIRMED },
      ],
    };
    return this.logEventModel
      .find(query)
      .sort(
        ({
          data: { date, make, take, price, filledAmount, id, type },
          status,
        }) => {
          const { maker, taker } = make;
          const { assetType: makeAssetType, assetValue: makeAssetValue } =
            make.asset;
          const { assetType: takeAssetType, assetValue: takeAssetValue } =
            take.asset;
          const { type: makeType } = make.type;
          const { type: takeType } = take.type;
          return {
            date,
            eventId: id,
            status,
            type,
            make: {
              maker,
              assetType: makeAssetType,
              assetValue: makeAssetValue,
              type: makeType,
            },
            take: {
              taker,
              assetType: takeAssetType,
              assetValue: takeAssetValue,
              type: takeType,
            },
            price,
            filledAmount,
          };
        },
      );
  }

  async getAssetActivity(
    assetType: string,
    assetValue: string,
    sort: ActivitySort,
    before?: Date,
    after?: Date,
    limit = 50,
  ): Promise<AggregatedData[]> {
    const assetTypeData = assetType.split('.');
    const makeType: NftAssetType | undefined =
      assetTypeData.length === 2
        ? (assetTypeData[1] as NftAssetType)
        : undefined;
    const data: any[] = [];
    // Find all "makes"
    const makePipeline: any[] = [
      {
        $match: {
          'data.make.asset.assetType': assetType,
          'data.make.asset.assetValue': assetValue,
        },
      },
      { $match: { status: LogEventStatus.CONFIRMED } },
      { $match: { topic: 'exchange' } },
      {
        $group: {
          _id: '$data.make.asset.assetType',
          maker: { $first: '$data.make.maker' },
          price: { $first: '$data.price' },
          type: { $first: '$data.make.type.type' },
          assetValue: { $first: '$data.make.asset.assetValue' },
          filledAmount: { $sum: '$data.filledAmount' },
          count: { $sum: 1 },
          latestDate: { $last: '$data.date' },
        },
      },
    ];

    if (makeType) {
      makePipeline[0].$match['data.make.type.type'] = makeType;
    }

    if (before) {
      makePipeline[1].$match['data.date'] = { $lt: before };
    }

    if (after) {
      makePipeline[2].$match['data.date'] = { $gte: after };
    }

    makePipeline.push(sort);

    if (limit) {
      makePipeline.push({ $limit: limit });
    }
    const makes = await this.logEventModel.aggregate(makePipeline).exec();

    for (const make of makes) {
      const {
        _id: assetType,
        maker,
        price,
        type,
        assetValue,
        filledAmount,
        count,
        latestDate,
      } = make;

      // Find all "takes"
      const takePipeline: any[] = [
        {
          $match: {
            'data.take.asset.assetType': assetType,
            'data.take.asset.assetValue': assetValue,
          },
        },
        { $match: { status: LogEventStatus.CONFIRMED } },
        { $match: { topic: 'exchange' } },
        {
          $group: {
            _id: '$data.take.asset.assetType',
            taker: { $first: '$data.take.taker' },
            price: { $first: '$data.price' },
            type,
          },
          assetValue: { $first: '$data.take.asset.assetValue' },
          filledAmount: { $sum: '$data.filledAmount' },
          count: { $sum: 1 },
          latestDate: { $last: '$data.date' },
        },
      ];

      // if (takeType) {
      //   takePipeline[0].$match['data.take.type.type'] = takeType;
      // }

      if (before) {
        takePipeline[1].$match['data.date'] = { $lt: before };
      }

      if (after) {
        takePipeline[2].$match['data.date'] = { $gte: after };
      }

      takePipeline.push(sort);

      if (limit) {
        takePipeline.push({ $limit: limit });
      }

      const takes = await this.logEventModel.aggregate(takePipeline).exec();

      for (const take of takes) {
        const {
          _id: assetType,
          taker,
          price,
          type,
          assetValue,
          filledAmount,
          count,
          latestDate,
        } = take;
        // Calculate total volume and price
        const totalVolume = Math.min(make.filledAmount, take.filledAmount);
        const totalPrice = totalVolume * price;

        // Add to data array
        data.push({
          maker,
          taker,
          assetType,
          assetValue,
          type,
          price,
          totalVolume,
          totalPrice,
          count,
          latestDate,
        });
      }

      // Sort by latest date
      data.sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime());

      return data;
    }
  }
}
