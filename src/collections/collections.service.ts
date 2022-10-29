import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { getEventData } from 'src/events/data';
import { ILike, In, Repository } from 'typeorm';
import { MetadataApi } from '../utils/metadata-api/metadata-api.utils';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { FilterDto } from './dto/filter.dto';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { Collections } from './entities/collections.entity';
@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    private collectionsRepo: Repository<Collections>,
    private rpcProvider: RpcProvider,
    private metadataApi: MetadataApi,
  ) {
    // 22512276;
    // 22512293;
    //sample function to use JsonRpcProvider and getting blockNumber
    const getBlock = async () => {
      try {
        const blockNumber =
          await this.rpcProvider.baseProvider.getBlockNumber();
        console.log(blockNumber, 'logged out blockNumber');
        const filter: { fromBlock: number; toBlock: number } = {
          fromBlock: blockNumber,
          toBlock: blockNumber,
        };
        const logs = await this.rpcProvider.baseProvider.getLogs(filter);

        for (const log of logs) {
          const availableEventData = getEventData(['erc721-transfer']);
          const eventData = availableEventData.find(
            ({ addresses, topic, numTopics }) =>
              log.topics[0] === topic &&
              log.topics.length === numTopics &&
              (addresses ? addresses[log.address.toLowerCase()] : true),
          );

          if (eventData) {
            const { args } = eventData.abi.parseLog(log);
            const token = log?.address;
            const tokenId = args?.tokenId.toString();
            const meta = await metadataApi.getTokenMetadata({ token, tokenId });
            console.log(meta, 'metadata');
          }
        }
      } catch (e) {
        console.log(e, 'error occured');
      }
    };
    getBlock();
    // this.metadataApi.fetchRequest(
    //   'ipfs://bafybeic3gaozbjh4dz2ynafota7oljv2isr2o3cnuadzrnxxwunhyrtf2i/39',
    //   '39',
    // );
  }

  /**
   * Create Collection in Database
   * @param createCollectionsInput
   * @returns  Created Collection
   */
  async createCollection(
    createCollectionsInput: CreateCollectionsInput,
  ): Promise<Collections> {
    try {
      const collection = this.collectionsRepo.create(createCollectionsInput);
      return await this.collectionsRepo.save(collection);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections ... With Filters
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async findAllCollections(filterDto: FilterDto): Promise<GetAllCollections> {
    try {
      const { page, limit, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.collectionsRepo.find({
          where: {
            collectionId: rest?.collectionId,
            name: rest?.name ? ILike(`%${rest?.name}%`) : undefined,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.collectionsRepo.count({
          where: {
            collectionId: rest.collectionId,
            name: rest?.name ? ILike(`%${rest.name}%`) : undefined,
          },
        }),
      ]);
      return { items, total };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * GET Collection By Id
   * @param id
   * @returns Collection against Provided Id
   */
  async getCollectionById(collectionId: string): Promise<Collections> {
    try {
      const found = await this.collectionsRepo.findOneByOrFail({
        collectionId,
      });
      if (!found) {
        throw new NotFoundException(
          `Collection against ${collectionId}} not found`,
        );
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Collections Attributes
   * @param updateCollectionsInput
   * @returns
   */
  async updateCollectionAttribute(
    updateCollectionsInput: UpdateCollectionsInput,
  ): Promise<Collections> {
    try {
      const { collectionId, ...rest } = updateCollectionsInput;
      await this.collectionsRepo.update({ collectionId }, rest);
      return this.getCollectionById(collectionId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Collection
   * @param collectionId
   * @returns Message that collection successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.collectionsRepo.delete({ collectionId: In(ids) });
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
