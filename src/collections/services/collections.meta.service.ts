import { Contract } from '@ethersproject/contracts';
import { Injectable } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { CollectionIface, getContractURI } from 'src/common/utils.common';
import { UrlService } from 'src/utils/url-service/url-service.service';

@Injectable()
export class CollectionsMetaService {
  constructor(
    private rpcProvider: RpcProvider,
    private urlService: UrlService,
  ) {}
  async resolve(collection: string) {
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
    } catch (error) {
      console.error(error);
    }
  }
}
