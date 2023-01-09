import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Collections } from 'src/collections/entities/collections.entity';
import { Contract } from '@ethersproject/contracts';
import {
  CollectionIface,
  getCollectionName,
  getCollectionSymbol,
  getCollectionOwner,
} from 'src/common/utils.common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { CreateCollectionsInput } from 'src/collections/dto/create-collections.input';
import { TokenStandards } from 'src/events/data/contractStandards';
import { utils } from 'ethers';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { CollectionsService } from 'src/collections/collections.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';
import detectProxyTarget from 'evm-proxy-detection';
@Injectable()
export class CollectionsRegistrationService {
  // todo need to handle cache here for the tokens.
  constructor(
    @Inject(forwardRef(() => CollectionsService))
    private readonly collectionsService: CollectionsService,
    @InjectRepository(Collections)
    @Inject(forwardRef(() => [MetadataApi]))
    private collectionsRepo: Repository<Collections>,
    private readonly rpcProvider: RpcProvider,
  ) {}

  async register(address: string): Promise<Collections> {
    return this.getOrSaveToken(address);
  }

  async getOrSaveToken(address: string): Promise<Collections | null> {
    try {
      const collection = await this.collectionsRepo.findOneBy({ id: address });
      if (collection) {
        return collection;
      }
      const fetchedToken = await this.fetchCollection(address);
      if (!fetchedToken) return null;
      return this.saveOrReturn(fetchedToken);
    } catch (error) {}
  }

  async saveOrReturn(
    createCollectionsInput: CreateCollectionsInput,
  ): Promise<Collections> {
    try {
      const collection = this.collectionsRepo.create(createCollectionsInput);
      const savedCollection = await this.collectionsRepo.save(collection);
      return savedCollection;
    } catch (error) {
      // need to handle dublicate enter error
      return this.collectionsService.show(createCollectionsInput.id);
      //   throw new BadRequestException(error);
    }
  }

  private async fetchCollection(
    address: string,
  ): Promise<CreateCollectionsInput | null> {
    const contract = new Contract(
      address,
      CollectionIface,
      this.rpcProvider.baseProvider,
    );
    const result = await Promise.all([
      getCollectionName(contract),
      getCollectionSymbol(contract),
      getCollectionOwner(contract),
      this.fetchTokenStandard(contract),
    ]);
    const [name, symbol, owner, type] = result;
    if (!type) return null;
    const collectionData: CreateCollectionsInput = {
      name,
      symbol,
      owner,
      id: address,
      type: CollectionType[type],
      Meta: { name },
      discordUrl: '',
      twitterUrl: '',
      description: '',
    };
    return collectionData;
  }

  private async fetchTokenStandard(
    contract: Contract,
  ): Promise<CollectionType | null> {
    const address = contract.address;
    for (const key of Object.keys(TokenStandards)) {
      const standard = TokenStandards[key];
      if (standard) {
        try {
          const isSupported = await contract.supportsInterface(
            standard.interfaceId,
          );
          if (isSupported) {
            return standard.id;
          }
        } catch (error) {
          continue;
        }
      }
    }
    return this.fetchTokenStandardByFunctionSignatures(address);
  }

  async fetchTokenStandardByFunctionSignatures(
    address: string,
  ): Promise<CollectionType | null> {
    const byteCode = await this.getBytecode(address);
    if (!byteCode) return null;
    for (const key of Object.keys(TokenStandards)) {
      const standard = TokenStandards[key];
      if (standard.functionSignatures.length > 0) {
        const nonMatchingSignatures = standard.functionSignatures.filter(
          (signature) => {
            const functionId = utils.id(signature).substring(2, 10);
            return !byteCode.includes(functionId);
          },
        );
        if (nonMatchingSignatures.length === 0) {
          return standard.id;
        }
      }
    }
    return null;
  }

  async getBytecode(address: string): Promise<string> {
    let code: string;
    try {
      const decodedAddress = await detectProxyTarget(
        address,
        this.rpcProvider.baseProvider.send as any,
      );
      code = await this.rpcProvider.baseProvider.getCode(decodedAddress);
    } catch (error) {}
    return code;
  }
}
