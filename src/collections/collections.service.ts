import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { lc } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';
import { ILike, In, Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { FilterDto as FilterCollectionsDto } from './dto/filter.collections.dto';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { Collections } from './entities/collections.entity';
@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    @Inject(forwardRef(() => MetadataApi))
    private collectionsRepo: Repository<Collections>,
    private rpcProvider: RpcProvider,
    private metadataApi: MetadataApi,
  ) {
    // sample function to use JsonRpcProvider and getting blockNumber
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
              (addresses ? addresses[lc(log.address)] : true),
          );
          if (eventData) {
            const timestamp = (
              await this.rpcProvider.baseProvider.getBlock(log.blockNumber)
            ).timestamp;
            const { args } = eventData.abi.parseLog(log);
            const collectionId = log?.address;
          }
        }
      } catch (e) {
        console.log(e, 'error occured');
      }
    };
  }

  /**
   * Create Collection in Database
   * @param createCollectionsInput
   * @returns  Created Collection
   */
  async create(
    createCollectionsInput: CreateCollectionsInput,
  ): Promise<Collections> {
    try {
      const collection = this.collectionsRepo.create(createCollectionsInput);
      const savedCollection = await this.collectionsRepo.save(collection);
      return savedCollection;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections ... With Filters
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async index(
    filterCollectionsDto: FilterCollectionsDto,
  ): Promise<GetAllCollections> {
    try {
      const { page = 1, limit = 20, ...rest } = filterCollectionsDto;
      const [items, total] = await Promise.all([
        this.collectionsRepo.find({
          where: {
            id: rest?.id,
            name: rest?.name ? ILike(`%${rest?.name}%`) : undefined,
            owner: rest?.owner ? ILike(`%${rest?.owner}%`) : undefined,
          },
          relations: { Meta: true },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.collectionsRepo.count({
          where: {
            id: rest?.id,
            name: rest?.name ? ILike(`%${rest?.name}%`) : undefined,
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
  async show(id: string): Promise<Collections> {
    try {
      const found = await this.collectionsRepo.findOneByOrFail({
        id,
      });
      if (!found) {
        throw new NotFoundException(`Collection against ${id}} not found`);
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Check if collection exist or not
   * @param id
   * @returns Collection against Provided Id
   */
  async collectionExistOrNot(id: string): Promise<Collections> {
    try {
      return await this.collectionsRepo.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Collections
   * @param updateCollectionsInput
   * @returns
   */
  async update(
    updateCollectionsInput: UpdateCollectionsInput,
  ): Promise<Collections> {
    try {
      const { id, ...rest } = updateCollectionsInput;
      const { owner } = await this.show(id);
      if (owner != rest.owner)
        throw new UnauthorizedException('The user is not the owner');
      await this.collectionsRepo.update({ id }, rest);
      return this.show(id);
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
      await this.collectionsRepo.delete({ id: In(ids) });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
