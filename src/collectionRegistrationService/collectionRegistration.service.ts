import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collections } from 'src/collections/entities/collections.entity';
import { Contract } from '@ethersproject/contracts';
import {
  CollectionIface,
  getCollectionName,
  getCollectionSymbol,
  getCollectionOwner,
} from 'src/common/utils.common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { TokenStandards } from 'src/events/data/contractStandards';
import { utils } from 'ethers';
import {
  CollectionType,
  FEATURE_SIGNATURES,
  CollectionFeature,
  CollectionFeatures,
} from 'src/collections/entities/enum/collection.type.enum';
import { CollectionsService } from 'src/collections/collections.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';
import detectProxyTarget from 'evm-proxy-detection';
import type { RequestArguments } from 'evm-proxy-detection/build/cjs/types';
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
      const collection = await this.collectionsRepo.findOneBy({
        id: address.toLowerCase(),
      });
      if (collection) {
        return collection;
      }
      const fetchedToken = await this.fetchCollection(address);
      if (!fetchedToken) return null;
      return this.saveOrReturn(fetchedToken);
    } catch (error) {}
  }

  async saveOrReturn(collection: Collections): Promise<Collections> {
    try {
      const savedCollection = await this.collectionsRepo.save(collection);
      return savedCollection;
    } catch (error) {
      try {
        // need to handle dublicate enter error
        const found = await this.collectionsRepo.findOneBy({
          id: collection.id,
        });
        if (found)
          throw new NotFoundException(
            `Collection against ${collection.id}} not found`,
          );

        return found;
        //   throw new BadRequestException(error);
      } catch (e) {
        throw new BadRequestException(e);
      }
    }
  }

  private async fetchCollection(address: string): Promise<Collections | null> {
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
      this.fetchFeatures(address),
    ]);
    const [name, symbol, owner, type, features] = result;
    if (!type || type === CollectionType.NONE) return null;
    const collectionData: Collections = this.collectionsRepo.create({
      name,
      symbol,
      owner,
      id: address,
      type,
      features,
    });
    return collectionData;
  }

  private async fetchTokenStandard(
    contract: Contract,
  ): Promise<CollectionType> {
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
  ): Promise<CollectionType> {
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
    return CollectionType.NONE;
  }

  private async fetchFeatures(address: string): Promise<CollectionFeature[]> {
    const features: Set<CollectionFeature> = new Set();
    const byteCode = await this.getBytecode(address);
    if (!byteCode) return [...features];
    Object.keys(FEATURE_SIGNATURES)
      .filter((signature) => byteCode.includes(signature.slice(2, 10)))
      .map((signature) => features.add(FEATURE_SIGNATURES[signature]));
    await Promise.all(
      Object.keys(CollectionFeatures).map(
        async (feature: CollectionFeature) => {
          const interfaces = CollectionFeatures[feature];
          const results = await Promise.allSettled(
            interfaces.map((iface) =>
              this.isErc165FeatureEnabled(address, iface),
            ),
          );
          if (
            results.some(
              (value) => value.status === 'fulfilled' && !!value.value,
            )
          )
            features.add(feature);
        },
      ),
    );
    return [...features];
  }

  private async isErc165FeatureEnabled(
    address: string,
    iface: string,
  ): Promise<boolean> {
    const contract = new Contract(
      address,
      CollectionIface,
      this.rpcProvider.baseProvider,
    );
    return await contract.supportsInterface(iface);
  }

  async getBytecode(address: string): Promise<string> {
    let code: string;
    try {
      const decodedAddress = await detectProxyTarget(
        address,
        async ({ method, params }: RequestArguments) =>
          this.rpcProvider.baseProvider.send(method, params),
      );
      code = await this.rpcProvider.baseProvider.getCode(
        decodedAddress ? decodedAddress : address,
      );
    } catch (error) {
      console.log(error, 'byte code error');
    }
    return code;
  }
}
