import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { CollectionIface, getContractURI } from 'src/common/utils.common';
import { UrlService } from 'src/utils/url-service/url-service.service';
import { Repository } from 'typeorm';
import { CollectionMeta } from '../dto/nestedObjects/collections.meta.dto';
import { CollectionsMeta } from '../entities/nestedObjects/collections.meta.entity';
@Injectable()
export class CollectionsMetaService {
  constructor(
    @InjectRepository(CollectionsMeta)
    private collectionsMetaRepo: Repository<CollectionsMeta>,
    private rpcProvider: RpcProvider,
    private urlService: UrlService,
    private httpService: HttpService,
  ) {}

  async get(collection: string): Promise<CollectionMeta> {
    try {
      const savedMeta = await this.collectionsMetaRepo.findOneBy({
        collectionId: collection,
      });
      // if the metadata is already saved but not being updated for the last hour. Try to update that.
      if (
        savedMeta &&
        (new Date().getTime() - new Date(savedMeta.lastUpdatedAt).getTime()) /
          60 /
          60 <
          1
      ) {
        return savedMeta;
      }
      const metadata = await this.resolve(collection);
      if (metadata) {
        // todo add cache here
        await this.collectionsMetaRepo.upsert(
          {
            ...metadata,
            collectionId: collection,
            collection: { id: collection },
          },
          { conflictPaths: ['collectionId'] },
        );
        return this.collectionsMetaRepo.findOneBy({ collectionId: collection });
      }
    } catch (error) {
      console.error(error);
    }
  }
  async resolve(collection: string): Promise<CollectionMeta | null> {
    try {
      const contract = new Contract(
        collection,
        CollectionIface,
        this.rpcProvider.baseProvider,
      );
      const uri = await getContractURI(contract);
      if (!uri) return null;
      const url = await this.urlService.resolveInternalHttpUrl(uri);
      if (!url) return null;
      // todo need to add url in the response here
      return await this.request(url);
    } catch (error) {
      console.error(error);
    }
  }

  private async request(url: string): Promise<CollectionMeta | null> {
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      if (!response || !response.data) return null;
      return this.map(response.data);
    } catch (error) {
      Logger.error('collection meta request error', error);
    }
  }

  private map(json: Record<string, any>): CollectionMeta {
    return {
      name: json.name ?? '',
      description: json.description ?? '',
      externalLink: json['external_link'] ?? '',
      sellerFeeBasisPoints: json['seller_fee_basis_points'] ?? '',
      feeRecipient: json['fee_recipient'] ?? '',
      // todo: need to handle image content here
    };
  }
}
