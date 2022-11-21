import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { getEventData } from 'src/events/data';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';
import { ILike, In, Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { FilterDto } from './dto/filter.collections.dto';
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
        // const res = await this.metadataApi.fetchRequest(
        //   'https://graphigo.prd.galaxy.eco/metadata/0xb034d6ba0b6593fa5107c6a55042b67746d44605/519709.json',
        //   '519709',
        // );
        // console.log(res);
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
            const timestamp = (
              await this.rpcProvider.baseProvider.getBlock(log.blockNumber)
            ).timestamp;
            // console.log(timestamp);
            const { args } = eventData.abi.parseLog(log);
            // console.log(args);
            const collectionId = log?.address;
            // const response = await this.metadataApi.getCollectionMetadata(
            //   token,
            //   CollectionType.BEP721,
            // );
            // console.log(response);

            const meta = await metadataApi.getTokenMetadata({
              collectionId: '0x3d24C45565834377b59fCeAA6864D6C25144aD6c',
              tokenId: '784735',
              type: TokenType.BEP721,
              timestamp: 1667500191,
            });

            // const tokenId = args?.tokenId.toString();
            // const meta = await metadataApi.getTokenMetadata({
            //   collectionId,
            //   tokenId,
            //   type: TokenType.BEP721,
            //   timestamp,
            // });
            console.log(meta, 'metadata');
          }
        }
      } catch (e) {
        console.log(e, 'error occured');
      }
    };
    // getBlock();

    // const hello = async () => {
    //   try {
    //     // console.log(this.rpcProvider.baseProvider, 'provider');
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // hello();
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
      console.log(filterDto);
      const { page, limit, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.collectionsRepo.find({
          where: {
            id: rest?.id,
            name: rest?.name ? ILike(`%${rest?.name}%`) : undefined,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.collectionsRepo.count({
          where: {
            id: rest.id,
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
  async getCollectionById(id: string): Promise<Collections> {
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

  async collectionExistOrNot(id: string): Promise<Collections> {
    try {
      return await this.collectionsRepo.findOne({ where: { id } });
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
      const { id, ...rest } = updateCollectionsInput;
      await this.collectionsRepo.update({ id }, rest);
      return this.getCollectionById(id);
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
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
