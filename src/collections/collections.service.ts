import { MetadataApi } from '../utils/metadata-api/metadata-api.utils';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { ILike, In, Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { FilterDto } from './dto/filter.dto';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { Collections } from './entities/collections.entity';
import { getEventData } from 'src/events/data';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    private collectionsRepo: Repository<Collections>,
    private rpcProvider: RpcProvider,
    private metadataApi: MetadataApi,
  ) {
    //sample function to use JsonRpcProvider and getting blockNumber
    const getBlock = async () => {
      try {
        const blockNumber =
          await this.rpcProvider.baseProvider.getBlockNumber();
        // const block = await this.rpcProvider.baseProvider.getBlock(blockNumber);
        // const blockTransactions =
        //   await this.rpcProvider.baseProvider.getBlockWithTransactions(
        //     blockNumber,
        //   );
        console.log(blockNumber, 'logged out blockNumber');
        // console.log(block, 'block', blockNumber);
        // console.log(blockTransactions, 'blockTransactions');
        // const data = getEventData(['erc721-transfer'])[0];
        const filter: { fromBlock: number; toBlock: number } = {
          fromBlock: 22311205,
          toBlock: 22311210,
        };
        const logs = await this.rpcProvider.baseProvider.getLogs(filter);
        // console.log(logs, 'getting logs');
        // ":/ipfs"
        // "https://arweave"
        // "://ar/"
        for (const log of logs) {
          // console.log(log.topics);
          // console.log(log.transactionHash);
          // console.log(log.topics.length);
          // console.log(logs, 'getting logs');
          const availableEventData = getEventData(['erc721-transfer']);
          const eventData = availableEventData.find(
            ({ addresses, topic, numTopics }) =>
              log.topics[0] === topic &&
              log.topics.length === numTopics &&
              (addresses ? addresses[log.address.toLowerCase()] : true),
          );

          if (eventData) {
            // console.log(eventData, 'eventdata');
            // console.log(log?.address, 'contract address');

            // console.log(eventData, 'logged EventData');
            const { args } = eventData.abi.parseLog(log);
            // console.log(args, 'logged');
            console.log(args?.tokenId.toString(), 'tokenid');
            const iface = new Interface([
              'function name() view returns (string)',
              'function symbol() view returns (string)',
              'function ownerOf(uint256 _tokenId) external view returns (address)',
              'function tokenURI(uint256 _tokenId) external view returns (string)',
            ]);

            // const contract = new Contract(
            //   log?.address,
            //   iface,
            //   this.rpcProvider.baseProvider,
            // );

            const token = log?.address;
            const tokenId = args?.tokenId.toString();
            metadataApi.getTokenMetadata({ token, tokenId });
            // const name = await contract.name();
            // const symbol = await contract.symbol();
            // const owner = await contract.ownerOf(args?.tokenId);
            // console.log(owner, 'owner of nft');

            // try {
            //   const tokenURI =
            //     (await contract.tokenURI(args?.tokenId)) || undefined;
            //   console.log(tokenURI, 'token URI of nft');
            // } catch (err) {
            //   console.log(err, 'error i am failed');
            // }
            // console.log(name, 'name of nft');
            // console.log(symbol, 'symbol of nft');
          }
        }
      } catch (e) {
        console.log(e, 'error occured');
      }
    };
    getBlock();
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
